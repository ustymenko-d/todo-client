'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { appStore } from '@/store/store'
import Header from '@/components/Header'

const RootPage = () => {
	const setAuthFormType = appStore((state) => state.setAuthFormType)

	return (
		<>
			<Header>
				<ThemeToggle />
			</Header>

			<main className='grow container mx-auto sm:border-x border-dashed px-2 py-8 flex flex-col justify-center'>
				<h1 className='mb-2 font-medium text-3xl text-center'>
					Welcome to UpTodo!
				</h1>
				<p className='mb-8 text-base text-center'>
					Manage and organize your tasks.
				</p>

				<div>
					<p className='mb-2 text-base text-center'>
						Please log in to your account or create a new one to continue.
					</p>

					<div className='flex gap-2 flex-wrap items-center justify-center'>
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
		</>
	)
}

export default RootPage
