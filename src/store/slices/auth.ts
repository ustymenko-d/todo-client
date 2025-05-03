import { TAuthForm, IUserInfo } from '@/types/auth'

export interface AuthSlice {
	authHydrated: boolean
	setAuthHydrated: (newValue: boolean) => void

	accountInfo: IUserInfo | null
	setAccountInfo: (
		newValue: IUserInfo | null | ((prev: IUserInfo | null) => IUserInfo | null)
	) => void

	authFormType: TAuthForm
	setAuthFormType: (newValue: TAuthForm) => void
}

const createAuthSlice = (
	set: (
		partial: Partial<AuthSlice> | ((state: AuthSlice) => Partial<AuthSlice>)
	) => void
): AuthSlice => ({
	authHydrated: false,
	setAuthHydrated: (authHydrated) => set({ authHydrated }),

	accountInfo: null,
	setAccountInfo: (accountInfoOrUpdater) =>
		set((state) => ({
			accountInfo:
				typeof accountInfoOrUpdater === 'function'
					? accountInfoOrUpdater(state.accountInfo)
					: accountInfoOrUpdater,
		})),

	authFormType: 'signin',
	setAuthFormType: (authFormType) => set({ authFormType }),
})

export default createAuthSlice
