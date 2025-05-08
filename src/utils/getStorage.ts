import { StateStorage } from 'zustand/middleware'

const getStorage = (): StateStorage =>
	typeof window === 'undefined'
		? {
				getItem: () => null,
				setItem: () => {},
				removeItem: () => {},
		  }
		: window.localStorage

export default getStorage
