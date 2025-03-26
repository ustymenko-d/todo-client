import { AuthFormType } from '@/types/auth'

export interface AuthSlice {
	isAuthorized: boolean
	setIsAuthorized: (newValue: boolean) => void

	authFormType: AuthFormType
	setAuthFormType: (newValue: AuthFormType) => void
}

const persistStorage = {
	storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
	setStorage: (newStorage: Storage) => {
		persistStorage.storage = newStorage
	},
}

const createAuthSlice = (
	set: (partial: Partial<AuthSlice>) => void
): AuthSlice => ({
	isAuthorized: false,
	setIsAuthorized: (isAuthorized) => set({ isAuthorized }),

	authFormType: 'login',
	setAuthFormType: (authFormType) => set({ authFormType }),
})

export default createAuthSlice
