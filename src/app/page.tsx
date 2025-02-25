'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { appStore } from '@/store/store'

const RootPage = () => {
	const setAuthFormType = appStore((state) => state.setAuthFormType)

	return (
		<div className='grow container mx-auto flex flex-col py-4 px-2'>
			<ThemeToggle />

			<main className='grow flex flex-col justify-center'>
				<h1 className='mb-2 font-medium text-3xl'>Welcome to UpTodo!</h1>
				<p className='mb-8 text-base'>Manage and organize your tasks.</p>

				<div>
					<p className='mb-2 text-base'>
						Please log in to your account or create a new one to continue.
					</p>

					<div className='flex gap-2 flex-wrap'>
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
			</main>
		</div>
	)
}

export default RootPage
