const createSingletonPromise = <T>(factory: () => Promise<T>) => {
	let promise: Promise<T> | null = null

	return async (): Promise<T> => {
		if (!promise) {
			promise = factory().finally(() => {
				promise = null
			})
		}

		return promise
	}
}

export default createSingletonPromise
