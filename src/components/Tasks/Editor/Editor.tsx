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
	const open = useAppStore((s) => s.taskEditorSettings.open)
	const mode = useAppStore((s) => s.taskEditorSettings.mode)
	const selectedTask = useAppStore((s) => s.taskEditorSettings.target)
	const closeEditor = useAppStore((s) => s.closeTaskEditor)

	const isEditing = mode === 'edit'
	const isCreating = mode === 'create'
	const isSubtask = isCreating && !!selectedTask

	const editorConfig = {
		title: isEditing
			? 'Edit task'
			: isSubtask
			? 'Create new subtask'
			: 'Create new task',
		description: isEditing
			? 'Update the task information below. All changes will be saved once you click "Edit task".'
			: 'Complete the form below to add a new task. Title is required, other fields are optional.',
	}

	return (
		<Dialog
			open={open}
			onOpenChange={closeEditor}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{editorConfig.title}</DialogTitle>
					<DialogDescription>{editorConfig.description}</DialogDescription>
				</DialogHeader>
				<EditorForm />
			</DialogContent>
		</Dialog>
	)
}

export default Editor
