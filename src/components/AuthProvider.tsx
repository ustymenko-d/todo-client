'use client'

import { useCallback, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/Axios/auth.service'

const useAuthentication = () => {
	const router = useRouter()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)

	const fetchAccountInfo = useCallback(async () => {
		try {
			if (!accountInfo) {
				const { data: accountInfo } = await AuthService.getAccountInfo()
				if (accountInfo) {
					setAccountInfo(accountInfo)
					if (!isAuthorized) setIsAuthorized(true)
				} else {
					await AuthService.clearAuthCookies()
					router.push('/')
				}
			}
		} catch (error) {
			console.error(error)
		}
	}, [accountInfo, isAuthorized, setAccountInfo, setIsAuthorized, router])

	return {
		fetchAccountInfo,
		isAuthorized,
		setIsAuthorized,
		accountInfo,
		setAccountInfo,
	}
}

const AuthProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	const {
		fetchAccountInfo,
		isAuthorized,
		setIsAuthorized,
		accountInfo,
		setAccountInfo,
	} = useAuthentication()
	const pathname = usePathname()
	const isHomePage = pathname === '/' || pathname.startsWith('/auth')
	const isDashboardPage = pathname.startsWith('/dashboard')

	useEffect(() => {
		if (isHomePage) {
			if (isAuthorized) setIsAuthorized(false)
			if (accountInfo) setAccountInfo(null)
		}
	
		if (isDashboardPage) {
			if (!isAuthorized || !accountInfo) {
				fetchAccountInfo()
			}
		}
	}, [accountInfo, fetchAccountInfo, isAuthorized, isDashboardPage, isHomePage, pathname, setAccountInfo, setIsAuthorized])

	return <>{children}</>
}

export default AuthProvider
