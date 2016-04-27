import Koa from 'koa';
import koarouter from 'koa-router';

const router = koarouter();

async function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('fel' + id));
    }, 2000);
  });
}

const app = new Koa();

router.get('/', async (next) => {
  try {
    const user = await getUser(2);

    next();
    console.log('fetched user' + user);
  } catch (e) {
    console.log('Could not fetch users', e.message);
  }

});

app
  .use(router.routes())
  .use(router.allowedMethods());


console.log('Serving at 3000');
app.listen(3000);
