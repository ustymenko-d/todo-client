'use client'

import { usePathname } from 'next/navigation'
import useAppStore from '@/store/store'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import MainMenu from '@/components/Header/components/MainMenu'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { ChevronLeft } from 'lucide-react'

const Header = () => {
	const pathname = usePathname()
	const accountInfo = useAppStore((state) => state.accountInfo)
	const isStartPage = pathname === '/' || pathname.startsWith('/auth')

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
				{accountInfo && !isStartPage && <MainMenu />}
				<ThemeToggle />
			</div>
		</header>
	)
}

export default Header
