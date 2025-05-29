import { TAuthForm } from '@/types/auth'

export interface AuthSlice {
	isAuthorized: boolean
	setIsAuthorized: (newValue: boolean) => void

	authFormType: TAuthForm
	setAuthFormType: (newValue: TAuthForm) => void
}

const createAuthSlice = (
	set: (
		partial: Partial<AuthSlice> | ((state: AuthSlice) => Partial<AuthSlice>)
	) => void
): AuthSlice => ({
	isAuthorized: false,
	setIsAuthorized: (isAuthorized) => set({ isAuthorized }),

	authFormType: 'signin',
	setAuthFormType: (authFormType) => set({ authFormType }),
})

export default createAuthSlice
