import { TAuthFormType, IUserInfo } from '@/types/auth'

export interface AuthSlice {
	isAuthorized: boolean
	setIsAuthorized: (newValue: boolean) => void

	accountInfo: IUserInfo | null
	setAccountInfo: (newValue: IUserInfo | null) => void

	authFormType: TAuthFormType
	setAuthFormType: (newValue: TAuthFormType) => void

	isOpenAccountDialog: boolean
	setIsOpenAccountDialog: (newValue: boolean) => void
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

	isOpenAccountDialog: false,
	setIsOpenAccountDialog: (isOpenAccountDialog) => set({ isOpenAccountDialog }),
})

export default createAuthSlice
