'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const useBreakpoints = (breakpoints: number[]): number => {
	const [index, setIndex] = useState(0)
	const timeoutId = useRef<number | null>(null)

	const updateIndex = useCallback(() => {
		const width = window.innerWidth
		const newIndex = breakpoints.findIndex((bp) => width <= bp)
		if (newIndex !== index) {
			setIndex(newIndex === -1 ? breakpoints.length : newIndex)
		}
	}, [breakpoints, index])

	useEffect(() => {
		const handleResize = () => {
			if (timeoutId.current !== null) {
				clearTimeout(timeoutId.current)
			}
			timeoutId.current = window.setTimeout(updateIndex, 150)
		}

		updateIndex()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			if (timeoutId.current !== null) {
				clearTimeout(timeoutId.current)
			}
		}
	}, [updateIndex])

	return index
}

export default useBreakpoints
