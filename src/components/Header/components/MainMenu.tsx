import useAppStore from '@/store/store'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import VerificationBadge from '@/components/ui/VerificationBadge'
import NavigationGroup from './NavigationGroup'
import LogoutButton from './LogoutButton'
import { Menu } from 'lucide-react'

const MainMenu = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)

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
						<span className='font-medium'>{accountInfo?.username}</span>
						<VerificationBadge />
					</div>
					<span className='text-sm font-light opacity-70'>
						{accountInfo?.email}
					</span>
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
