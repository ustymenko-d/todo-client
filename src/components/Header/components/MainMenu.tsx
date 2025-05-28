import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import VerificationBadge from '@/components/ui/VerificationBadge'
import useAccountInfo from '@/hooks/useAccountInfo'

import LogoutButton from './LogoutButton'
import NavigationGroup from './NavigationGroup'

const MainMenu = () => {
	const { data } = useAccountInfo()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className='flex gap-1'
					variant='outline'>
					<Menu />
					<span className='unvisible sm:visible'>Menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start'>
				<DropdownMenuGroup className='flex flex-col px-3 py-2'>
					<div className='flex items-center gap-2'>
						<span className='font-medium'>{data?.username}</span>
						<VerificationBadge />
					</div>
					<span className='text-sm font-light opacity-70'>{data?.email}</span>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<NavigationGroup />
				<DropdownMenuSeparator />
				<LogoutButton />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default MainMenu
