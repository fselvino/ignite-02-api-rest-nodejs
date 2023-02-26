import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionRoutes } from './routes/transactions'
import { Log } from './middleware/log'

export const app = fastify()

app.register(cookie)

// Hook para criar um log de onde o usuario passo no site
// app.addHook('preHandler', Log) //cria o log da rota acessada
app.register(transactionRoutes, {
  prefix: 'transactions',
})
