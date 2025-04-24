'use client'

import useAppStore from '@/store/store'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const HomeLink = ({ type }: { type: 'login' | 'signup' }) => {
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)

	return (
		<Link
			className={buttonVariants({
				variant: type === 'login' ? 'default' : 'outline',
			})}
			href='/auth'
			onClick={() => {
				setAuthFormType(type)
			}}>
			{type === 'login' ? 'Log in' : 'Sign up'}
		</Link>
	)
}

export default HomeLink
