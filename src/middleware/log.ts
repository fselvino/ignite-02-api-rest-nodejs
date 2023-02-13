import { FastifyReply, FastifyRequest } from 'fastify'

export async function Log(request: FastifyRequest, replay: FastifyReply) {
  // cosegue pegar por onde o usuario transitou no site - cria um log
  console.log(`[${request.method}] ${request.url}`)
}
