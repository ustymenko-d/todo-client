'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ComponentProps, useEffect, useState } from 'react'

const ThemeProvider = ({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider>) => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return <div className='opacity-0'>{children}</div>

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default ThemeProvider
