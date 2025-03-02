'use client'

import AuthService from '@/services/api/auth'
import { appStore } from '@/store/store'
import TokenService from '@/utils/token'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

const RefreshPage = () => {
	const router = useRouter()
	const isRememberUser = appStore((state) => state.isRememberUser)
	const hasRun = useRef(false)

	const authCheck = useCallback(async () => {
		if (hasRun.current) return
		hasRun.current = true

		const accessToken = TokenService.getStorageToken()

		if (!accessToken) {
			router.replace('/')
		}

		if (accessToken && !TokenService.verifyToken(accessToken)) {
			try {
				const response = await AuthService.refreshToken()

				if (response.accessToken) {
					TokenService.setStorageToken(response.accessToken, isRememberUser)
					router.replace('/dashboard')
				} else {
					router.replace('/')
				}
			} catch (error) {
				console.error('Token refresh failed:', error)
				router.replace('/')
			}
		}
	}, [isRememberUser, router])

	useEffect(() => {
		authCheck()
	}, [authCheck])

	return null
}

export default RefreshPage
