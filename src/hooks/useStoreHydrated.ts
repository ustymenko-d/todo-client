import { useEffect, useState } from 'react'
import useAppStore from '@/store/store'

const useStoreHydrated = () => {
	const [storeHydrated, setStoreHydrated] = useState(
		useAppStore.persist.hasHydrated()
	)

	useEffect(() => {
		if (useAppStore.persist.hasHydrated()) return

		const unsub = useAppStore.persist.onFinishHydration(() => {
			setStoreHydrated(true)
		})

		return unsub
	}, [])

	return storeHydrated
}

export default useStoreHydrated
