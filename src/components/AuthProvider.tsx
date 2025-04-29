'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'

const AuthProvider = () => {
	const pathname = usePathname()

	const authHydrated = useAppStore((s) => s.authHydrated)
	const setAuthHydrated = useAppStore((s) => s.setAuthHydrated)
	const setIsAuthorized = useAppStore((s) => s.setIsAuthorized)
	const setAccountInfo = useAppStore((s) => s.setAccountInfo)

	const [storeReady, setStoreReady] = useState(false)
	const isStartPage = pathname === '/' || pathname.startsWith('/auth')

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
		if (!storeReady || authHydrated || isStartPage) return

		const fetchAccountData = async () => {
			try {
				const { data } = await AuthService.getAccountInfo()
				if (data?.username) {
					setAccountInfo(data)
					setIsAuthorized(true)
				} else {
					throw new Error('No user data')
				}
			} catch {
				setIsAuthorized(false)
				setAccountInfo(null)
				await AuthService.clearAuthCookies()
			} finally {
				setAuthHydrated(true)
			}
		}
		console.log('[AuthProvider] fetch')

		fetchAccountData()
	}, [
		authHydrated,
		isStartPage,
		setAccountInfo,
		setAuthHydrated,
		setIsAuthorized,
		storeReady,
	])

	return null
}

export default AuthProvider
