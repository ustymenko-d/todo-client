'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'

const AuthProvider = () => {
	const pathname = usePathname()
	const isStartPage = pathname === '/' || pathname.startsWith('/auth')

	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)

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
		if (!storeReady || authHydrated || isStartPage) return

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
	}, [authHydrated, isStartPage, setAccountInfo, setAuthHydrated, storeReady])

	return null
}

export default AuthProvider
