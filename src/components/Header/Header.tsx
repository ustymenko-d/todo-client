'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '../Theme/ThemeToggle'
import AccountActions from './AccountActions'
import { buttonVariants } from '../ui/button'
import { ChevronLeft } from 'lucide-react'
import { appStore } from '@/store/store'

const Header = () => {
	const pathname = usePathname()
	const isAuthorized = appStore((state) => state.isAuthorized)

	return (
		<header className='border-b border-dashed min-h-14'>
			<div className='container flex flex-wrap items-center px-2 mx-auto border-dashed lg:px-4 sm:border-x min-h-14 gap-x-2'>
				{pathname.startsWith('/auth') && (
					<Link
						className={buttonVariants({
							variant: 'outline',
							size: 'icon',
						})}
						href='/'
						replace>
						<ChevronLeft />
					</Link>
				)}
				<ThemeToggle />
				{pathname.startsWith('/dashboard') && isAuthorized && (
					<AccountActions />
				)}
			</div>
		</header>
	)
}

export default Header
