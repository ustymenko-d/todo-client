import isEqual from 'lodash.isequal'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import useAppStore from '@/store/store'
import isStartPage from '@/utils/isStartPage'

export const useCrossTabAuthSync = () => {
	const router = useRouter()
	const pathname = usePathname()

	const isAuthorized = useAppStore((s) => s.isAuthorized)
	const setIsAuthorized = useAppStore((s) => s.setIsAuthorized)

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key !== 'app-store' || !event.newValue) return

			try {
				const { state: incomingState } = JSON.parse(event.newValue)

				if (!incomingState) return

				const incomingAuth = incomingState.isAuthorized

				if (isEqual(isAuthorized, incomingAuth)) return

				setIsAuthorized(incomingAuth)

				if (incomingAuth === false && !isStartPage(pathname))
					router.replace('/')
				else if (incomingAuth === true && isStartPage(pathname))
					router.replace('/home')
			} catch (error) {
				console.error('[CrossTabSync] Failed to parse state:', error)
			}
		}

		window.addEventListener('storage', handleStorage)
		return () => window.removeEventListener('storage', handleStorage)
	}, [isAuthorized, pathname, router, setIsAuthorized])
}
