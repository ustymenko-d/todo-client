'use client'

import useAppStore from '@/store/store'

const Head = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)

	return (
		<div className='flex flex-col'>
			<h1 className='text-xl font-semibold tracking-tight'>
				Welcome back
				{accountInfo?.username ? `, ${accountInfo?.username}!` : '!'}
			</h1>
			<p className='text-base text-muted-foreground'>
				Here&apos;s the main navigation menu for the application:
			</p>
		</div>
	)
}

export default Head
