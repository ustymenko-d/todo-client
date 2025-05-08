'use client'

import useAppStore from '@/store/store'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const HomeLink = ({ type }: { type: 'signin' | 'signup' }) => {
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)

	const handleClick = () => {
		setAuthFormType(type)
	}

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

export default HomeLink
