'use client'

import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import useAppStore from '@/store/store'
import Link from 'next/link'
import MainMenu from '@/components/Header/components/MainMenu'
import ThemeToggle from '@/components/theme/ThemeToggle'
import { ChevronLeft } from 'lucide-react'

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
				{isAuthorized && <MainMenu />}
				<ThemeToggle />
			</div>
		</header>
	)
}

export default Header
