'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useAppStore from '@/store/store'

import Form from './components/Form'

const Editor = () => {
	const { open: isOpen, mode } = useAppStore((s) => s.folderEditorSettings)

	const closeEditor = useAppStore((s) => s.closeFolderEditor)

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
