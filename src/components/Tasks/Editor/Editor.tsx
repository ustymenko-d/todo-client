'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import TaskForm from './compoonents/TaskForm'
import useAppStore from '@/store/store'

const Editor = () => {
	const closeEditor = useAppStore((state) => state.closeTaskEditor)
	const open = useAppStore((state) => state.taskEditorSettings.open)
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
					<DialogDescription>* indicates required fields</DialogDescription>
				</DialogHeader>
				<TaskForm />
			</DialogContent>
		</Dialog>
	)
}

export default Editor
