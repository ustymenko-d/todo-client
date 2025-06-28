import createSingletonPromise from './createSingletonPromise'

describe('createSingletonPromise', () => {
	it('resolves to the same result and calls factory only once for concurrent calls', async () => {
		const factory = jest.fn(() => Promise.resolve('result'))
		const singleton = createSingletonPromise(factory)

		const [res1, res2] = await Promise.all([singleton(), singleton()])

		expect(factory).toHaveBeenCalledTimes(1)
		expect(res1).toBe('result')
		expect(res2).toBe('result')
	})

	it('calls factory again after promise resolves', async () => {
		let counter = 0
		const factory = jest.fn(() => Promise.resolve(++counter))
		const singleton = createSingletonPromise(factory)

		const firstCall = await singleton()
		const secondCall = await singleton()

		expect(factory).toHaveBeenCalledTimes(2)
		expect(firstCall).toBe(1)
		expect(secondCall).toBe(2)
	})

	it('retries factory if previous call was rejected', async () => {
		let shouldFail = true
		const factory = jest.fn(() =>
			shouldFail ? Promise.reject('error') : Promise.resolve('success')
		)
		const singleton = createSingletonPromise(factory)

		await expect(singleton()).rejects.toBe('error')
		expect(factory).toHaveBeenCalledTimes(1)

		shouldFail = false

		const success = await singleton()
		expect(factory).toHaveBeenCalledTimes(2)
		expect(success).toBe('success')
	})
})
