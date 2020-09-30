let postId = 1; //id의 초기값

// post 배열의 초기 데이터
const posts = [
  {
    id: 1,
    title: 'title',
    body: 'context',
  },
];

// 포스트 작성
// POST/api/posts
// {title,body}
export const write = (ctx) => {
  //REST API의 Request bodysms ctx.request.body에서 조회할 수 있다.
  const { title, body } = ctx.request.body;
  postId += 1; // 기존 postid값에 1을 더함
  const post = { id: postId, title, body };
  posts.push(post);
  ctx.body = post;
};

//포스트 목록 조회
//GET /api / posts
export const list = (ctx) => {
  ctx.body = posts;
};

//특정포트스 조회 GET/api/:id
export const read = (ctx) => {
  const { id } = ctx.params;
  //주어진 id 값으로 포스트를 찾음
  //파라미터로 받아 온 값은 문자열 형식이므로 파라미터를 숫자로 변환하거나 비교할 p.id값을 문자열로 변경해야
  const post = post.find((p) => p.id.toString() === id);
  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  ctx.body = post;
};

//특정 포스트 제거 DELETE/api/posts/:id
export const remove = (ctx) => {
  const { id } = ctx.params;
  //해당 id를 가진 포스트가 몇번째 인지 확인
  const index = post.findIndex((p) => p.id.toString === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  //index 번째 아이템을 제거합니다.
  posts.splice(index, 1);
  ctx.status = 204; //no content
};

//포스트 수정 (교체) PUT/api/posts/:id
export const replace = (ctx) => {
  //포스트 전체 정보를 입력해 데이터를 통째로 교체할 때 사용
  const { id } = ctx.params;
  //해당 아이디를 가진 post가 몇 번째인지 확인
  const index = posts.findIndex((p) => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  // 전체 객체를 덮어 씌움
  // 따라서 id를 제외한 기존 정보를 ㅏㄴㄹ리고 객체를 새로 만든다
  posts[index] = {
    id,
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};

//포스트 수정 (특정필드 변경) PATCH/api/posts/:id
// {title,body}
export const update = (ctx) => {
  //path매서드는 주어진 필드만 교체
  const { id } = ctx.params;
  //해당 id를 가진 post가 몇 번 째인지 확인
  const index = posts.findIndex((p) => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  //기존 값에 정보를 덮어씌운다.
  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};
