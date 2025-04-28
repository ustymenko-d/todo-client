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

	const isIndexPage = useMemo(
		() => ({
			isIndexPage: pathname === '/' || pathname.startsWith('/auth'),
		}),
		[pathname]
	)

	const fetchAccountInfo = useCallback(async () => {
		try {
			const { data } = await AuthService.getAccountInfo()

			if (data) {
				setAccountInfo(data)
			} else {
				await AuthService.clearAuthCookies()
				router.push('/')
			}
		} catch (error) {
			console.error('Failed to fetch account info:', error)
		}
	}, [setAccountInfo, router])

	useEffect(() => {
		if (isIndexPage) {
			if (isAuthorized) setIsAuthorized(false)
			if (accountInfo) setAccountInfo(null)
		} else {
			if (!isAuthorized) setIsAuthorized(true)
			if (!accountInfo) fetchAccountInfo()
		}
	}, [
		pathname,
		isIndexPage,
		accountInfo,
		setAccountInfo,
		fetchAccountInfo,
		isAuthorized,
		setIsAuthorized,
	])

	return <>{children}</>
}

export default AuthProvider
