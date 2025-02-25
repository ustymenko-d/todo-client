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
}

export const appStore = create<IAppStore>()(
	devtools(
		persist(
			(set) => ({
				authFormType: 'login',
				setAuthFormType: (newValue: AuthFormType) =>
					set({ authFormType: newValue }),
			}),
			{
				name: 'Todo_App_Store',
				storage: createJSONStorage(() => sessionStorage),
			}
		)
	)
)
