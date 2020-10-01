import mongoose from 'mongoose';
import Post from '../../models/post';
import Joi from '@hapi/joi';

//objectId를 검증해야 하는 api는 read, remove,update 세가지.
//모든 함수에서 검증하려고 한다면 코드가 길어지므로 상단에  미들웨어를 만든다
// 미들웨어를 만든 후, src/api/posts/index.js 에서 검증이 필요한 부분에 다음 미들웨어를 추가
const { objectId } = mongoose.Types;

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!objectId.isValid(id)) {
    ctx.status = 400; //bad request
    return;
  }
  try {
    const post = await Post.findById(id);
    //포스트가 존재하지 않을 떄
    if (!post) {
      ctx.status = 404; // not found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 글쓰기 */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검즘
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  //검증 실패인 경우 에러처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 
조회하기 
GET /api/posts?username=&tag=&page=
*/
export const list = async (ctx) => {
  // paging
  // 1. query 는 문자열이므로 숫자로 변환이 필요하다.
  // 2. 값이 없을 경우 1을 기본 값으로
  // 3. 마지막 페이지 번호 알려주기 (커스텀 헤더 활용)
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  //tag, username값이 유효하면 객체 안에 넣고, 아니면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*특정 포스트 조회 */
export const read = (ctx) => {
  ctx.body = ctx.state.post;
};

/*삭제*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; //no content (성공하기는 했으나 응답할 데이터는 없음 )
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*수정*/
export const update = async (ctx) => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, //이 값을 설정하면 업데이트 된 데이터를 반환
      //false일 때는 업데이트 되기 전의 데이터를 반환
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }

  /*찾은 포스트가 로그인중인 사용자가 작성한 포스트인지 확인*/
  export const checkOwnPost = (ctx, next) => {
    const { user, post } = ctx.state;
    if (post.user._id.toString() !== user._id) {
      ctx.status = 403;
      return;
    }
    return next();
  };
};
