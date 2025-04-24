'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'
import FoldersService from '@/services/folders.service'

const useAuthentication = () => {
	const router = useRouter()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const folders = useAppStore((state) => state.folders)
	const setFolders = useAppStore((state) => state.setFolders)
	const resetFolders = useAppStore((state) => state.resetFolders)

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
					return
				}
			}

			const { data, status } = await FoldersService.getFolders({
				page: 1,
				limit: 25,
			})

			if (status === 200) {
				setFolders(data.folders)
			}
		} catch (error) {
			console.error('[AuthProvider] Failed to fetch account info:', error)
		}
	}, [
		accountInfo,
		setAccountInfo,
		isAuthorized,
		setIsAuthorized,
		router,
		setFolders,
	])

	return {
		fetchAccountInfo,
		isAuthorized,
		setIsAuthorized,
		accountInfo,
		setAccountInfo,
		folders,
		resetFolders,
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
		folders,
		resetFolders,
	} = useAuthentication()
	const pathname = usePathname()
	const { isHomePage, isDashboardPage } = useMemo(
		() => ({
			isHomePage: pathname === '/' || pathname.startsWith('/auth'),
			isDashboardPage: pathname.startsWith('/dashboard'),
		}),
		[pathname]
	)

	useEffect(() => {
		if (isHomePage) {
			if (isAuthorized) setIsAuthorized(false)
			if (accountInfo) setAccountInfo(null)
			if (folders) resetFolders()
		}

		if (isDashboardPage && (!isAuthorized || !accountInfo)) {
			fetchAccountInfo()
		}
	}, [
		accountInfo,
		fetchAccountInfo,
		folders,
		isAuthorized,
		isDashboardPage,
		isHomePage,
		pathname,
		resetFolders,
		setAccountInfo,
		setIsAuthorized,
	])

	return <>{children}</>
}

export default AuthProvider
