'use client'

import { usePathname, useRouter } from 'next/navigation'
import { TaskBaseDto, TaskDto } from '@/dto/tasks'
import { toast } from 'sonner'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import TaskForm from './compoonents/TaskForm'
import useAppStore from '@/store/store'
import TasksService from '@/services/tasks.service'

const TaskEditor = () => {
	const router = useRouter()
	const pathname = usePathname()

	const closeTaskEditor = useAppStore((state) => state.closeTaskEditor)
	const { open, mode, selectedTask } = useAppStore(
		(state) => state.taskEditorSettings
	)

	const handleTaskAction = async (taskData: TaskBaseDto | TaskDto) => {
		const payload = { ...selectedTask, ...taskData }
		delete payload.subtasks

		try {
			const { data } =
				mode === 'create'
					? await TasksService.createTask(payload)
					: await TasksService.editTask(payload)

			const { success } = data

			if (success) {
				toast.success(
					mode === 'create'
						? 'Task successfully created'
						: 'Task successfully edited'
				)
				closeTaskEditor()
				if (pathname === '/dashboard') router.replace(`?page=1&limit=25`)
			} else {
				toast.error('Failed to process task')
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error(`Error while creating a task: ${error}`)
		}
	}

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
					<TaskForm handleTaskAction={handleTaskAction} />
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default TaskEditor
