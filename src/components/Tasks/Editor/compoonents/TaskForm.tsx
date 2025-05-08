'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@/store/store'
import TasksValidation from '@/schemas/tasks.schema'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import FormDatePicker from '@/components/Tasks/Editor/compoonents/FormDatePicker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/ui/LoadingButton'
import Field from '@/components/Tasks/Editor/compoonents/Field'
import FormSelect from '@/components/Tasks/Editor/compoonents/FormSelect'
import { TTask, TTaskBase } from '@/types/tasks'
import useTaskActions from '@/hooks/useTaskActions'

const TaskForm = () => {
	const mode = useAppStore((state) => state.taskEditorSettings.mode)
	const selectedTask = useAppStore((state) => state.taskEditorSettings.target)

	const [loading, setLoading] = useState(false)
	const isEditing = mode === 'edit'

	const { handleTaskAction: createTask } = useTaskActions('create')
	const { handleTaskAction: editTask } = useTaskActions(
		'edit',
		selectedTask as TTask
	)

	const defaultValues = useMemo<TTaskBase>(
		() => ({
			title: isEditing ? selectedTask?.title || '' : '',
			description: isEditing ? selectedTask?.description : '',
			parentTaskId: isEditing
				? selectedTask?.parentTaskId
				: selectedTask?.id || null,
			startDate:
				isEditing && selectedTask?.startDate
					? new Date(selectedTask.startDate)
					: null,
			expiresDate:
				isEditing && selectedTask?.expiresDate
					? new Date(selectedTask.expiresDate)
					: null,
			folderId: isEditing ? selectedTask?.folderId : null,
		}),
		[isEditing, selectedTask]
	)

	const taskForm = useForm<TTaskBase>({
		resolver: zodResolver(TasksValidation.taskBase),
		defaultValues,
	})

	const createPayload = (values: TTaskBase): TTaskBase | TTask => {
		const base: TTaskBase = {
			...values,
			completed: !isEditing ? false : selectedTask?.completed ?? false,
			startDate: values.startDate ? new Date(values.startDate) : null,
			expiresDate: values.expiresDate ? new Date(values.expiresDate) : null,
		}

		if (mode === 'create') return base

		const payload = { ...selectedTask, ...base }
		delete payload.subtasks
		delete payload.lastEdited
		return payload
	}

	const handleSubmit = async (values: TTaskBase) => {
		const payload = createPayload(values)

		if (mode === 'create') {
			createTask(setLoading, payload as TTaskBase)
		} else {
			editTask(setLoading, payload as TTask)
		}
	}

	return (
		<Form {...taskForm}>
			<form onSubmit={taskForm.handleSubmit(handleSubmit)}>
				<div className='flex flex-col gap-4'>
					<Field
						taskForm={taskForm}
						name='title'
						Component={Input}
						placeholder='Title of the task *'
					/>
					<Field
						taskForm={taskForm}
						name='description'
						Component={Textarea}
						placeholder='Add some description'
					/>

					<div className='grid grid-cols-2 gap-3'>
						<FormField
							control={taskForm.control}
							name='startDate'
							render={({ field }) => (
								<FormItem className='flex flex-col gap-1'>
									<FormLabel className='text-muted-foreground'>
										Start date:
									</FormLabel>
									<FormControl>
										<FormDatePicker field={field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={taskForm.control}
							name='expiresDate'
							render={({ field }) => (
								<FormItem className='flex flex-col gap-1'>
									<FormLabel className='text-muted-foreground'>
										Expires date:
									</FormLabel>
									<FormControl>
										<FormDatePicker field={field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={taskForm.control}
						name='folderId'
						render={({ field }) => (
							<FormItem className='flex flex-col gap-1'>
								<FormLabel className='text-muted-foreground'>Folder:</FormLabel>
								<FormSelect field={field} />
								<FormMessage />
							</FormItem>
						)}
					/>

					<LoadingButton
						loading={loading}
						disabled={loading}
						type='submit'>
						<span>{mode === 'create' ? 'Create task' : 'Edit task'}</span>
					</LoadingButton>
				</div>
			</form>
		</Form>
	)
}

export default TaskForm
