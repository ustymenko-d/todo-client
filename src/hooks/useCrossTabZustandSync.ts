import { useEffect } from 'react'
import useAppStore from '@/store/store'
import isEqual from 'lodash.isequal'

export const useCrossTabZustandSync = () => {
	const setState = useAppStore.setState
	const getState = useAppStore.getState

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key !== 'app-store' || !event.newValue) return

			try {
				const { state: incomingState } = JSON.parse(event.newValue)

				if (!incomingState) return

				const currentState = {
					accountInfo: getState().accountInfo,
				}

				if (isEqual(currentState, incomingState)) return

				setState((prev) => ({
					...prev,
					...incomingState,
				}))
			} catch (err) {
				console.error('[CrossTabSync] Failed to parse state:', err)
			}
		}

		window.addEventListener('storage', handleStorage)
		return () => window.removeEventListener('storage', handleStorage)
	}, [getState, setState])
}
