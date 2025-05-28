import { TAuthForm } from '@/types/auth'

export interface AuthSlice {
	authFormType: TAuthForm
	setAuthFormType: (newValue: TAuthForm) => void
}

const createAuthSlice = (
	set: (
		partial: Partial<AuthSlice> | ((state: AuthSlice) => Partial<AuthSlice>)
	) => void
): AuthSlice => ({
	authFormType: 'signin',
	setAuthFormType: (authFormType) => set({ authFormType }),
})

export default createAuthSlice
