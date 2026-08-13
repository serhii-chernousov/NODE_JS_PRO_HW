import { describe, it, expect, afterEach } from 'vitest'
import { buildApp } from '../src/server.mjs'

describe('GET /health', () => {
	let app
	let pool

	afterEach(async () => {
		await app?.close()
		await pool?.end()
	})

	it('повертає status: ok', async () => {
		;({ app, pool } = buildApp())
		const res = await app.inject({ method: 'GET', url: '/health' })
		expect(res.statusCode).toBe(200)
		expect(res.json()).toEqual({ status: 'ok' })
	})
})

describe('GET /users', () => {
	let app
	let pool

	afterEach(async () => {
		await app?.close()
		await pool?.end()
	})

	it('без DATABASE_URL повертає 503', async () => {
		const prev = process.env.DATABASE_URL
		delete process.env.DATABASE_URL
		;({ app, pool } = buildApp())
		const res = await app.inject({ method: 'GET', url: '/users' })
		expect(res.statusCode).toBe(503)
		if (prev !== undefined) process.env.DATABASE_URL = prev
	})
})
