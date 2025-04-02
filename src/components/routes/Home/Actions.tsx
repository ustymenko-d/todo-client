'use client'

import Link from 'next/link'
import useAppStore from '@/store/store'
import { Button, buttonVariants } from '../../ui/button'
import Axios from '@/services/Axios'

const HomeActions = () => {
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)

	return (
		<div className='flex flex-col gap-2'>
			<p className='text-base text-center xl:text-lg'>
				Please log in to your account or create a new one to continue.
			</p>

			<Button
				onClick={async () => {
					try {
						const res = await Axios.post('/login', {
							email: 'yllaciarbegla@gmail.com',
							password: 'Secure123',
							rememberMe: true,
						})
						console.log('Login successful:', res.data)
					} catch (error) {
						console.error('Login error:', error)
					}
				}}
				variant={'outline'}>
				Test Login
			</Button>

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
