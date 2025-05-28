'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useAppStore from '@/store/store'

import EditorForm from './components/EditorForm'

const Editor = () => {
	const { open, mode } = useAppStore((s) => s.taskEditorSettings)
	const closeEditor = useAppStore((s) => s.closeTaskEditor)

	return (
		<Dialog
			open={open}
			onOpenChange={closeEditor}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'edit' ? 'Edit task' : 'Create new task'}
					</DialogTitle>
					<DialogDescription>
						{mode === 'edit'
							? 'Update the task information below. All changes will be saved once you click "Edit task".'
							: 'Complete the form below to add a new task. Title is required, other fields are optional.'}
					</DialogDescription>
				</DialogHeader>
				<EditorForm />
			</DialogContent>
		</Dialog>
	)
}

export default Editor
