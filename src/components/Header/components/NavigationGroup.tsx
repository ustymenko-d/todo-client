import { usePathname } from 'next/navigation'
import {
	DropdownMenuGroup,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { navItems } from '@/const'

const NavigationGroup = () => {
	const pathname = usePathname()

	return (
		<DropdownMenuGroup className='flex flex-col gap-1'>
			{navItems.map(({ href, label, icon: Icon }) => {
				const isActive = pathname === href
				const commonClasses =
					'flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm'
				const iconClasses = '!w-5 !h-5 opacity-60'

				const content = (
					<>
						<Icon
							strokeWidth={1.5}
							className={iconClasses}
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
