'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import MainMenu from '@/components/Header/components/MainMenu'
import { buttonVariants } from '@/components/ui/button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import useAccountInfo from '@/hooks/useAccountInfo'
import isStartPage from '@/utils/isStartPage'

const Header = () => {
	const pathname = usePathname()
	const { data } = useAccountInfo()

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
				{data && !isStartPage(pathname) && <MainMenu />}
				<ThemeToggle />
			</div>
		</header>
	)
}

export default Header
