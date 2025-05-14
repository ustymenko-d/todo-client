import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname()
	const needResetAuth = pathname === '/' || pathname.startsWith('/auth')

	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const [storeReady, setStoreReady] = useState(false)

	useEffect(() => {
		const unsub = useAppStore.persist.onFinishHydration(() => {
			setStoreReady(true)
		})

		if (useAppStore.persist.hasHydrated()) {
			setStoreReady(true)
		}

		return unsub
	}, [])

	useEffect(() => {
		if (needResetAuth) {
			setAccountInfo(null)
			setFoldersWithTasks([])
			setAuthHydrated(false)
		}
	}, [needResetAuth, setAccountInfo, setAuthHydrated, setFoldersWithTasks])

	useEffect(() => {
		if (!storeReady || authHydrated || needResetAuth) return

		const fetchAccountData = async () => {
			try {
				const { data } = await AuthService.getAccountInfo()

				if (data?.username) {
					setAccountInfo(data)
				} else {
					throw new Error('No user data')
				}
			} catch {
				setAccountInfo(null)
				await AuthService.clearAuthCookies()
			} finally {
				setAuthHydrated(true)
			}
		}

		fetchAccountData()
	}, [authHydrated, needResetAuth, setAccountInfo, setAuthHydrated, storeReady])

	return <>{children}</>
}

export default AuthProvider
