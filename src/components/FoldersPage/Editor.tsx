'use client'

import useAppStore from '@/store/store'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import Form from './components/Form'

const Editor = () => {
	const { open: isOpen, mode } = useAppStore(
		(state) => state.folderEditorSettings
	)
	const closeEditor = useAppStore((state) => state.closeFolderEditor)

	return (
		<Dialog
			open={isOpen}
			onOpenChange={closeEditor}>
			<DialogContent className='sm:max-w-sm'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'edit' ? 'Rename folder' : 'Create new folder'}
					</DialogTitle>
					<DialogDescription>
						{mode === 'edit'
							? 'Enter a new folder name'
							: 'Enter the name of the new folder'}
					</DialogDescription>
				</DialogHeader>
				<Form />
			</DialogContent>
		</Dialog>
	)
}

export default Editor
