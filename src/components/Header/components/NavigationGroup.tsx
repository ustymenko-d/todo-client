'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
	DropdownMenuGroup,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { navItems } from '@/const'
import { cn } from '@/lib/utils'

const NavigationGroup = () => {
	const pathname = usePathname()

	return (
		<DropdownMenuGroup className='flex flex-col gap-1'>
			{navItems.map(({ href, label, icon: Icon }) => {
				const isActive = pathname === href
				const commonClasses =
					'flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm'

				const content = (
					<>
						<Icon
							strokeWidth={1.5}
							className='!w-5 !h-5 opacity-60'
						/>
						{label}
					</>
				)

				return (
					<DropdownMenuItem
						key={href}
						asChild
						className={cn(isActive && 'cursor-default')}>
						{isActive ? (
							<div
								className={cn(
									commonClasses,
									'bg-muted text-primary font-medium'
								)}>
								{content}
							</div>
						) : (
							<Link
								href={href}
								className={cn(commonClasses, 'hover:bg-accent')}>
								{content}
							</Link>
						)}
					</DropdownMenuItem>
				)
			})}
		</DropdownMenuGroup>
	)
}

export default NavigationGroup
