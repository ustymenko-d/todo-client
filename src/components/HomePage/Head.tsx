'use client'

import useAccountInfo from '@/hooks/useAccountInfo'

const Head = () => {
	const { data } = useAccountInfo()

	return (
		<div className='flex flex-col gap-1'>
			<h1 className='text-xl font-semibold tracking-tight'>
				Welcome back
				{data?.username ? `, ${data?.username}!` : '!'}
			</h1>
			<p className='text-base text-muted-foreground'>
				Here&apos;s the main navigation menu for the application:
			</p>
		</div>
	)
}

export default Head
