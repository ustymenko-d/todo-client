import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import AccountInfo from './AccountInfo'
import LogoutButton from './LogoutButton'
import NavigationGroup from './NavigationGroup'

const MainMenu = () => (
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
				<AccountInfo />
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<NavigationGroup />
			<DropdownMenuSeparator />
			<LogoutButton />
		</DropdownMenuContent>
	</DropdownMenu>
)

export default MainMenu
