const jsonTypes = [
  'application/json'
]
const formType = [
  'application/x-www-form-urlencoded',
  'multipart/form-data'
]

function koaBody() {
  return async (ctx, next) => {
    let rawData = [];
    if (!ctx.req.method || ctx.req.method === 'GET') await next();
    //get post data
    ctx.req.addListener('data', data => {
      rawData.push(data);
    })
    ctx.req.addListener('end', async () => {
      console.log(rawData.toString('utf-8'));
      //parse body
      switch (ctx.req.method) {
        case 'POST':
          handlePost(ctx, rawData);
          break;
      }
      //run the next middleware
      await next();
    })
  }
}

function handlePost(ctx, rawData) {
  if (!ctx) return new Error('Ctx is undefined.');
  const contentType = ctx.req.headers['content-type'];
  //test json
  let isJson = jsonTypes.find(val => val === contentType);
  if (isJson) {
    switch (isJson) {
      case 'application/json':
        try {
          ctx.req.body = JSON.parse(rawData);
        } catch {
          return new Error('Json content type error.');
        }
      default:
        return new Error('Unknown content-type.');
    }
  }
  //test form
  let isForm = null;
  formType.forEach(val => {
    isForm = contentType.indexOf(val) === -1 ? null : val;
  })
  if (isForm) {
    console.log(isForm);
  }
}

module.exports = koaBody;
