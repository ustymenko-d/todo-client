import { TAuthFormType, IUserInfo } from '@/types/auth'

export interface AuthSlice {
	authHydrated: boolean
	setAuthHydrated: (newValue: boolean) => void

	isAuthorized: boolean
	setIsAuthorized: (newValue: boolean) => void

	accountInfo: IUserInfo | null
	setAccountInfo: (
		newValue: IUserInfo | null | ((prev: IUserInfo | null) => IUserInfo | null)
	) => void

	authFormType: TAuthFormType
	setAuthFormType: (newValue: TAuthFormType) => void

	isOpenAccountDialog: boolean
	setIsOpenAccountDialog: (newValue: boolean) => void
}

const createAuthSlice = (
	set: (
		partial: Partial<AuthSlice> | ((state: AuthSlice) => Partial<AuthSlice>)
	) => void
): AuthSlice => ({
	authHydrated: false,
	setAuthHydrated: (authHydrated) => set({ authHydrated }),

	isAuthorized: false,
	setIsAuthorized: (isAuthorized) => set({ isAuthorized }),

	accountInfo: null,
	setAccountInfo: (accountInfoOrUpdater) =>
		set((state) => ({
			accountInfo:
				typeof accountInfoOrUpdater === 'function'
					? accountInfoOrUpdater(state.accountInfo)
					: accountInfoOrUpdater,
		})),

	authFormType: 'login',
	setAuthFormType: (authFormType) => set({ authFormType }),

	isOpenAccountDialog: false,
	setIsOpenAccountDialog: (isOpenAccountDialog) => set({ isOpenAccountDialog }),
})

export default createAuthSlice
