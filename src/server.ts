import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { transactionRoutes } from './routes/transactions'
import { Log } from './middleware/log'

const app = fastify()

app.register(cookie)

// Hook para criar um log de onde o usuario passo no site
app.addHook('preHandler', Log)
app.register(transactionRoutes, {
  prefix: 'transactions',
})
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
