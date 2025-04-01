'use client'

import { useCallback, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AuthService from '@/services/api/auth'
import useAppStore from '@/store/store'

const useAccount = () => {
	const router = useRouter()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)

	const fetchAccountInfo = useCallback(async () => {
		try {
			if (!accountInfo) {
				const response = await AuthService.checkAuth()
				if (response) {
					setAccountInfo(response)
					if (!isAuthorized) setIsAuthorized(true)
				} else {
					await AuthService.clearAuthCookies()
					router.replace('/')
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

const AccountProvider = ({
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
	} = useAccount()
	const pathname = usePathname()

	useEffect(() => {
		if (pathname === '/' || pathname.startsWith('/auth')) {
			if (isAuthorized) setIsAuthorized(false)
			if (accountInfo) setAccountInfo(null)
		}

		if (pathname.startsWith('/dashboard')) {
			fetchAccountInfo()
		}
	}, [
		accountInfo,
		fetchAccountInfo,
		isAuthorized,
		pathname,
		setAccountInfo,
		setIsAuthorized,
	])

	return <>{children}</>
}

export default AccountProvider
