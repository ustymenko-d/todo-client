import useAppStore from '@/store/store'
import {
	DropdownMenuGroup,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Folder } from 'lucide-react'

const FoldersGroup = () => {
	const setIsOpenFoldersDialog = useAppStore(
		(state) => state.setIsOpenFoldersDialog
	)

	const handleOpenFoldersDialog = () => {
		requestAnimationFrame(() => {
			setIsOpenFoldersDialog(true)
		})
	}

	return (
		<DropdownMenuGroup>
			<DropdownMenuItem
				onSelect={handleOpenFoldersDialog}
				className='flex items-center gap-2'>
				<Folder className='opacity-60' />
				Folders
			</DropdownMenuItem>
		</DropdownMenuGroup>
	)
}

export default FoldersGroup
