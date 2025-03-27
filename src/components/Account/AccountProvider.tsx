'use client'

import { useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AuthService from '@/services/api/auth'
import useAppStore from '@/store/store'

const AccountProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	const pathname = usePathname()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)

	const fetchAccountInfo = useCallback(async () => {
		if (pathname.startsWith('/dashboard')) {
			if (!isAuthorized) setIsAuthorized(true)
			if (!accountInfo) setAccountInfo(await AuthService.accountInfo())
		} else {
			if (isAuthorized) setIsAuthorized(false)
			if (accountInfo) setAccountInfo(null)
		}
	}, [pathname, isAuthorized, accountInfo, setIsAuthorized, setAccountInfo])

	useEffect(() => {
		fetchAccountInfo()
	}, [fetchAccountInfo])

	return <>{children}</>
}

export default AccountProvider
