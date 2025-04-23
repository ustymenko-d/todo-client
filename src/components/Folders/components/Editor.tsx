'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useAppStore from '@/store/store'
import Form from './Form'

const Editor = () => {
	const isOpen = useAppStore((state) => state.folderEditorSettings.open)
	const closeEditor = useAppStore((state) => state.closeFolderEditor)
	const mode = useAppStore((state) => state.folderEditorSettings.mode)

	return (
		<Dialog
			open={isOpen}
			onOpenChange={closeEditor}>
			<DialogContent className='sm:max-w-[425px]'>
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
