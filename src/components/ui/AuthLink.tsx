'use client'

import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import useAppStore from '@/store/store'

const AuthLink = ({ type }: { type: 'signin' | 'signup' }) => {
	const setAuthFormType = useAppStore((s) => s.setAuthFormType)
	const handleClick = () => setAuthFormType(type)

	return (
		<Link
			className={buttonVariants({
				variant: type === 'signin' ? 'default' : 'outline',
			})}
			href='/auth'
			onClick={handleClick}>
			{type === 'signin' ? 'Sign in' : 'Sign up'}
		</Link>
	)
}

export default AuthLink
