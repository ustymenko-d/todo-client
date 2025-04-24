import useAppStore from '@/store/store'
import {
	DropdownMenuGroup,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { CircleUser } from 'lucide-react'

const AccountGroup = () => {
	const setIsOpenAccountDialog = useAppStore(
		(state) => state.setIsOpenAccountDialog
	)

	const handleOpenAccountDialog = () => {
		requestAnimationFrame(() => {
			setIsOpenAccountDialog(true)
		})
	}

	return (
		<DropdownMenuGroup>
			<DropdownMenuItem
				onSelect={handleOpenAccountDialog}
				className='flex items-center gap-2'>
				<CircleUser className='opacity-60' />
				Profile
			</DropdownMenuItem>
		</DropdownMenuGroup>
	)
}

export default AccountGroup
