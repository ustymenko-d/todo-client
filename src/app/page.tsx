'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { appStore } from '@/store/store'

const RootPage = () => {
	const setAuthFormType = appStore((state) => state.setAuthFormType)

	return (
		<>
			<div className='border-b border-dashed'>
				<div className='container border-x border-dashed mx-auto flex flex-col py-[10] px-2'>
					<ThemeToggle />
				</div>
			</div>

			<main className='grow container mx-auto border-x border-dashed px-2 flex flex-col justify-center'>
				<h1 className='mb-2 font-medium text-3xl text-center'>Welcome to UpTodo!</h1>
				<p className='mb-8 text-base text-center'>Manage and organize your tasks.</p>

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
