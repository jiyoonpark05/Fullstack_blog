import Router from 'koa-router';
import * as postCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

posts.get('/', postCtrl.list);
posts.post('/', checkLoggedIn, postCtrl.write);

//api/posts/:id를 위한 라우터를 새로 만들고 posts에 해당 라우터를 등록
const post = new Router();

posts.get('/', postCtrl.read);
posts.delete('/', checkLoggedIn, postCtrl.checkOwnPost, postCtrl.remove);
posts.patch('/', checkLoggedIn, postCtrl.checkOwnPost, postCtrl.update);

post.use('/:id', postCtrl.getPostById, post.routes());

export default posts;
