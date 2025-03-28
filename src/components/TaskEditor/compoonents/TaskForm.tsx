'use client'

import { ElementType, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TasksValidation, { TaskFormSchema } from '@/schemas/tasksSchema'
import { TaskBaseDto } from '@/dto/tasks'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import FormDatePicker from './FormDatePicker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/ui/LoadingButton'
import useAppStore from '@/store/store'

interface TaskFormProps {
	handleTaskAction: (payload: TaskBaseDto) => void
}

const TaskForm = ({ handleTaskAction }: TaskFormProps) => {
	const { mode, selectedTask } = useAppStore(
		(state) => state.taskEditorSettings
	)
	const [loading, setLoading] = useState<boolean>(false)
	const isEditing = mode === 'edit'

	const defaultValues = useMemo<TaskFormSchema>(
		() => ({
			title: isEditing ? selectedTask?.title || '' : '',
			description: isEditing ? selectedTask?.description || '' : '',
			parentTaskId: isEditing
				? selectedTask?.parentTaskId
				: selectedTask?.id || null,
			expiresAt:
				isEditing && selectedTask.expiresAt
					? new Date(selectedTask.expiresAt)
					: null,
			folderId: isEditing ? selectedTask?.folderId || null : null,
		}),
		[isEditing, selectedTask]
	)

	const taskForm = useForm<TaskFormSchema>({
		resolver: zodResolver(TasksValidation.taskFormSchema),
		defaultValues,
	})

	const onSubmit = async (values: TaskFormSchema) => {
		setLoading(true)
		try {
			const payload: TaskBaseDto = {
				...values,
				completed: !isEditing ? false : selectedTask?.completed,
				expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
			}
			handleTaskAction(payload)
		} finally {
			setLoading(false)
		}
	}

	const renderFormField = (
		name: keyof TaskFormSchema,
		label: string,
		placeholder: string,
		Component: ElementType
	) => {
		return (
			<FormField
				control={taskForm.control}
				name={name}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<Component
								{...field}
								placeholder={placeholder}
								value={field.value || ''}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		)
	}

	return (
		<Form {...taskForm}>
			<form onSubmit={taskForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					{renderFormField('title', 'Title', 'Title of the task *', Input)}
					{renderFormField(
						'description',
						'Description',
						'Add some description',
						Textarea
					)}
					<FormField
						control={taskForm.control}
						name='expiresAt'
						render={({ field }) => (
							<FormItem className='flex flex-col gap-1'>
								<FormLabel>Set expires date</FormLabel>
								<FormControl>
									<FormDatePicker field={field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<LoadingButton
						loading={loading}
						type='submit'>
						<span>{mode === 'create' ? 'Create task' : 'Edit task'}</span>
					</LoadingButton>
				</div>
			</form>
		</Form>
	)
}

export default TaskForm
