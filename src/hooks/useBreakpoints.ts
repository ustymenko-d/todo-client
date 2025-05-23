'use client'

import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface IUseBreakpointsOptions {
	width?: number[]
	height?: number[]
}

const useBreakpoints = ({
	width = [],
	height = [],
}: IUseBreakpointsOptions) => {
	const [indices, setIndices] = useState<{
		widthIndex: number
		heightIndex: number
	}>({
		widthIndex: 0,
		heightIndex: 0,
	})

	const updateIndices = useCallback(() => {
		const currentWidth = window.innerWidth
		const currentHeight = window.innerHeight

		const newWidthIndex = width.length
			? width.findLastIndex((bp) => currentWidth >= bp) + 1
			: 0

		const newHeightIndex = height.length
			? height.findLastIndex((bp) => currentHeight >= bp) + 1
			: 0

		setIndices((prev) => {
			if (
				prev.widthIndex !== newWidthIndex ||
				prev.heightIndex !== newHeightIndex
			) {
				return {
					widthIndex: newWidthIndex,
					heightIndex: newHeightIndex,
				}
			}
			return prev
		})
	}, [width, height])

	const debouncedUpdate = useMemo(
		() => debounce(updateIndices, 150),
		[updateIndices]
	)

	useEffect(() => {
		updateIndices()

		const handleResize = () => {
			debouncedUpdate()
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			debouncedUpdate.cancel()
		}
	}, [debouncedUpdate, updateIndices])

	return indices
}

export default useBreakpoints
