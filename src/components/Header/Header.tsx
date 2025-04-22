'use client'

import { usePathname } from 'next/navigation'
import { buttonVariants } from '../ui/button'
import useAppStore from '@/store/store'
import Link from 'next/link'
import MainMenu from './components/MainMenu'
import ThemeToggle from '../theme/ThemeToggle'
import { ChevronLeft } from 'lucide-react'
import AccountDialog from '../Account/AccountDialog'

const Header = () => {
	const pathname = usePathname()
	const isAuthorized = useAppStore((state) => state.isAuthorized)

	return (
		<header className='sticky top-0 z-10 border-b border-dashed backdrop-blur'>
			<div className='container flex flex-wrap items-center px-2 mx-auto border-dashed lg:px-4 sm:border-x min-h-14 gap-x-2'>
				{pathname.startsWith('/auth') && (
					<Link
						className={buttonVariants({
							variant: 'outline',
							size: 'icon',
						})}
						href='/'>
						<ChevronLeft />
					</Link>
				)}
				{isAuthorized && (
					<>
						<MainMenu />
						<AccountDialog />
					</>
				)}
				<ThemeToggle />
			</div>
		</header>
	)
}

export default Header
