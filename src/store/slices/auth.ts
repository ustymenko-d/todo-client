export type AuthFormType = 'login' | 'signup' | 'forgotPassword'

export interface IUserInfo {
	id: string
	email: string
	username: string
	createdAt: Date
	isVerified: boolean
}

export interface AuthSlice {
	isAuthorized: boolean
	setIsAuthorized: (newValue: boolean) => void

	userInfo: IUserInfo | null
	setUserInfo: (newValue: IUserInfo | null) => void

	authFormType: AuthFormType
	setAuthFormType: (newValue: AuthFormType) => void

	isRememberUser: boolean
	toggleIsRememberUser: () => void
}

const persistStorage = {
	storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
	setStorage: (newStorage: Storage) => {
		persistStorage.storage = newStorage
	},
}

const createAuthSlice = (
	set: (partial: Partial<AuthSlice>) => void,
	get: () => AuthSlice
): AuthSlice => ({
	isAuthorized: false,
	setIsAuthorized: (newValue) => set({ isAuthorized: newValue }),

	userInfo: null,
	setUserInfo: (newValue) => set({ userInfo: newValue }),

	authFormType: 'login',
	setAuthFormType: (newValue) => set({ authFormType: newValue }),

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
})

export default createAuthSlice
