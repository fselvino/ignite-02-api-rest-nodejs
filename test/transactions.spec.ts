import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  // garante que todos plugins estejam caregados
  beforeAll(async () => {
    await app.ready() // retorna um valor valido quando o fastify terminar de cadastrar os plugins
  })

  // fecha a aplicacao assim que os testes forem realizados
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    // execSync possibilita rodar comando com se estivesse no terminal
    execSync('npm run knex migrate:rollback --all') // Apaga todo banco antes de rodar novamente o teste
    execSync('npm run knex migrate:latest') // Roda as migrates para criar as tabelas no baco de test
  })
  it('should be able to create a new transaction', async () => {
    // fazer a chamada HTTP cria uma nova transacao

    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    // console.log(response.body)
  })

  it('should be able to list all transactions', async () => {
    const createTransctionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransctionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransctionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransctionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const trasactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${trasactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransctionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransctionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',

        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
