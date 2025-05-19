import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'
import useStoreHydrated from '@/hooks/useStoreHydrated'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname()
	const storeHydrated = useStoreHydrated()
	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)

	const isStartRoute = pathname === '/' || pathname.startsWith('/auth')

	useEffect(() => {
		if (!isStartRoute) return

		setAccountInfo(null)
		setAuthHydrated(false)
	}, [isStartRoute, setAccountInfo, setAuthHydrated])

	useEffect(() => {
		if (!storeHydrated || authHydrated || isStartRoute) return

		const hydrateAccount = async () => {
			try {
				const { data: account } = await AuthService.getAccountInfo()
				setAccountInfo(account)
			} catch {
				setAccountInfo(null)
				await AuthService.clearAuthCookies()
			} finally {
				setAuthHydrated(true)
			}
		}

		hydrateAccount()
	}, [
		storeHydrated,
		authHydrated,
		isStartRoute,
		setAccountInfo,
		setAuthHydrated,
	])

	return <>{children}</>
}

export default AuthProvider
