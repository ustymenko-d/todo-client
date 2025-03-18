'use client'

import Link from 'next/link'
import useAppStore from '@/store/store'
import { buttonVariants } from '@/components/ui/button'

const RootPage = () => {
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)

	return (
		<>
			<div className='flex flex-col gap-2 mb-6'>
				<h1 className='text-3xl font-bold text-center sm:text-4xl xl:text-5xl'>
					Welcome to UpTodo!
				</h1>
				<p className='text-base font-medium text-center sm:text-xl xl:text-2xl'>
					Manage and organize your tasks.
				</p>
			</div>

			<div className='flex flex-col gap-2'>
				<p className='text-base text-center xl:text-lg'>
					Please log in to your account or create a new one to continue.
				</p>

				<div className='flex flex-wrap items-center justify-center gap-2'>
					<Link
						className={buttonVariants({ variant: 'default' })}
						href='/auth'
						onClick={() => {
							setAuthFormType('login')
						}}>
						Log in
					</Link>
					<Link
						className={buttonVariants({ variant: 'outline' })}
						href='/auth'
						onClick={() => {
							setAuthFormType('signup')
						}}>
						Sign up
					</Link>
				</div>
			</div>
		</>
	)
}

export default RootPage
