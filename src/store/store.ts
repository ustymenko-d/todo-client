import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

export type AuthFormType =
	| 'login'
	| 'signup'
	| 'forgotPassword'
	| 'resetPassword'

interface IAppStore {
	authFormType: AuthFormType
	setAuthFormType: (newValue: AuthFormType) => void

	isRememberUser: boolean
	toggleIsRememberUser: () => void
}

export const appStore = create<IAppStore>()(
	devtools(
		persist(
			(set, get) => ({
				authFormType: 'login',
				setAuthFormType: (newValue: AuthFormType) =>
					set({ authFormType: newValue }),

				isRememberUser: false,
				toggleIsRememberUser: () =>
					set({ isRememberUser: !get().isRememberUser }),
			}),
			{
				name: 'Todo_App_Store',
				storage: createJSONStorage((): Storage => {
					const state = appStore.getState()
					return state.isRememberUser ? localStorage : sessionStorage
				}),
			}
		)
	)
)
