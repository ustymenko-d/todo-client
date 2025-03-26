'use client'

import Link from 'next/link'
import useAppStore from '@/store/store'
import { buttonVariants } from '../../ui/button'

const HomeActions = () => {
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)

	return (
		<div className='flex flex-col gap-2'>
			<p className='text-base text-center xl:text-lg'>
				Please log in to your account or create a new one to continue.
			</p>

			<div className='grid grid-cols-2 gap-2 mx-auto w-fit'>
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
	)
}

export default HomeActions
