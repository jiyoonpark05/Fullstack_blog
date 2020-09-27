const Router = require('koa-router');
const posts = new Router();

const pirntInfo = (ctx) => {
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params,
  };
};

posts.get('/', pirntInfo);
posts.post('/', pirntInfo);
posts.get('/:id', pirntInfo);
posts.delete('/:id', pirntInfo);
posts.put('/:id', pirntInfo);
posts.patch('/:id', pirntInfo);
module.exports = posts;
