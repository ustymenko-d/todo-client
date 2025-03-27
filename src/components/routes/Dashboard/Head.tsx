'use client'

import useAppStore from '@/store/store'

const Head = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)

	return (
		<div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
			<div className='flex flex-col'>
				<h1 className='text-2xl font-semibold tracking-tight'>
					Welcome back
					{accountInfo?.username ? `, ${accountInfo?.username}!` : '!'}
				</h1>
				<p className='text-base text-muted-foreground'>
					Here&apos;s a list of your tasks
				</p>
			</div>
		</div>
	)
}

export default Head
