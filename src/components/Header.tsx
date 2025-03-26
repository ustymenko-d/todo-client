'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './Theme/ThemeToggle'
import { buttonVariants } from './ui/button'
import { ChevronLeft } from 'lucide-react'

const Header = () => {
	const pathname = usePathname()

	return (
		<header className='border-b border-dashed'>
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
			</div>
		</header>
	)
}

export default Header
