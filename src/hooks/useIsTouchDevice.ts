'use client'

import { useEffect, useState } from 'react'

const useIsTouchDevice = () => {
	const [isTouchDevice, setIsTouchDevice] = useState(() => {
		if (typeof window === 'undefined') return false
		return window.matchMedia('(pointer: coarse)').matches
	})

	useEffect(() => {
		const mq = window.matchMedia('(pointer: coarse)')
		setIsTouchDevice(mq.matches)

		const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches)
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [])

	return isTouchDevice
}

export default useIsTouchDevice
