'use client'

import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

const useBreakpoints = (breakpoints: number[]): number => {
	const [index, setIndex] = useState(0)

	const updateIndex = useCallback(() => {
		const width = window.innerWidth
		const newIndex = breakpoints.findLastIndex((bp) => width >= bp) + 1
		setIndex(newIndex)
	}, [breakpoints])

	const debouncedUpdateIndex = useMemo(
		() => debounce(updateIndex, 150),
		[updateIndex]
	)

	useEffect(() => {
		updateIndex()

		const handleResize = () => {
			debouncedUpdateIndex()
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			debouncedUpdateIndex.cancel()
		}
	}, [debouncedUpdateIndex, updateIndex])

	return index
}

export default useBreakpoints
