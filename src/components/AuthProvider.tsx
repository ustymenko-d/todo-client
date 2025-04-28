'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'

const AuthProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	const router = useRouter()
	const pathname = usePathname()

	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)

	const { isHomePage, isDashboardPage } = useMemo(
		() => ({
			isHomePage: pathname === '/' || pathname.startsWith('/auth'),
			isDashboardPage: pathname.startsWith('/dashboard'),
		}),
		[pathname]
	)

	const fetchAccountInfo = useCallback(async () => {
		try {
			const { data: accountInfo } = await AuthService.getAccountInfo()
			if (accountInfo) {
				setAccountInfo(accountInfo)
				if (!isAuthorized) setIsAuthorized(true)
			} else {
				await AuthService.clearAuthCookies()
				router.push('/')
				return
			}
		} catch (error) {
			console.error('[AuthProvider] Failed to fetch account info:', error)
		}
	}, [setAccountInfo, isAuthorized, setIsAuthorized, router])

	useEffect(() => {
		if (isHomePage) {
			if (isAuthorized) setIsAuthorized(false)
			if (accountInfo) setAccountInfo(null)
		}

		if (isDashboardPage && (!isAuthorized || !accountInfo)) {
			fetchAccountInfo()
		}
	}, [
		pathname,
		isHomePage,
		isDashboardPage,
		accountInfo,
		setAccountInfo,
		fetchAccountInfo,
		isAuthorized,
		setIsAuthorized,
	])

	return <>{children}</>
}

export default AuthProvider
