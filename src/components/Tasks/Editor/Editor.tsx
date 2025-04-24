'use client'

import useAppStore from '@/store/store'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import TaskForm from './compoonents/TaskForm'

const Editor = () => {
	const open = useAppStore((state) => state.taskEditorSettings.open)
	const closeEditor = useAppStore((state) => state.closeTaskEditor)
	const mode = useAppStore((state) => state.taskEditorSettings.mode)

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
				<TaskForm />
			</DialogContent>
		</Dialog>
	)
}

export default Editor
