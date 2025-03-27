import { AuthFormType, IUserInfo } from '@/types/auth'

export interface AuthSlice {
	isAuthorized: boolean
	setIsAuthorized: (newValue: boolean) => void

	accountInfo: IUserInfo | null
	setAccountInfo: (newValue: IUserInfo | null) => void

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

	accountInfo: null,
	setAccountInfo: (accountInfo) => set({ accountInfo }),

	authFormType: 'login',
	setAuthFormType: (authFormType) => set({ authFormType }),
})

export default createAuthSlice
