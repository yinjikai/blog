import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
var app = new Koa()
app.use(cors())
app.use(bodyParser())

app.use(async (ctx, next) => {
  const page = ctx.request.query.page
  const data = []
  for (let i = (page - 1) * 20; i < page * 20; i++) {
    data.push(i)
  }
  await new Promise((resolve) => {
    setTimeout(() => {
      ctx.body = {
        data: data,
      }
      resolve()
    }, 1000)
  })
})
app.listen(3000)
