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
	const closeTaskEditor = useAppStore((state) => state.closeTaskEditor)
	const open = useAppStore((state) => state.taskEditorSettings.open)
	const mode = useAppStore((state) => state.taskEditorSettings.mode)

	return (
		<Dialog
			open={open}
			onOpenChange={closeTaskEditor}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'edit' ? 'Edit task' : 'Create new task'}
					</DialogTitle>
					<DialogDescription>* indicates required fields</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<TaskForm />
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default Editor
