import { create } from 'zustand'
import {
	createJSONStorage,
	devtools,
	persist,
	StateStorage,
} from 'zustand/middleware'

export type AuthFormType = 'login' | 'signup' | 'forgotPassword'

interface AppStore {
	authFormType: AuthFormType
	setAuthFormType: (newValue: AuthFormType) => void

	isRememberUser: boolean
	toggleIsRememberUser: () => void
}

const getStorage = (): StateStorage => {
	if (typeof window === 'undefined') {
		return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {},
		}
	}
	return window.sessionStorage
}

const persistStorage = {
	storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
	setStorage: (newStorage: Storage) => {
		persistStorage.storage = newStorage
	},
}

export const appStore = create<AppStore>()(
	devtools(
		persist(
			(set, get) => ({
				authFormType: 'login',
				setAuthFormType: (newValue: AuthFormType) =>
					set({ authFormType: newValue }),

				isRememberUser: false,
				toggleIsRememberUser: () => {
					if (typeof window !== 'undefined') {
						const newValue = !get().isRememberUser
						set({ isRememberUser: newValue })
						persistStorage.setStorage(
							newValue ? window.localStorage : window.sessionStorage
						)
					}
				},
			}),
			{
				name: 'Todo_App_Store',
				storage: createJSONStorage(getStorage),
			}
		)
	)
)
