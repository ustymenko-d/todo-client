'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import LoadingButton from '@/components/ui/LoadingButton'
import { Textarea } from '@/components/ui/textarea'
import TasksValidation, { TaskFormSchema } from '@/schemas/tasksSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormDatePicker from './FormDatePicker'
import { TaskBaseDto } from '@/dto/tasks'
import { toast } from 'sonner'
import TasksService from '@/services/api/tasks'

interface TaskFormProps {
	handleClose: () => void
}

const TaskForm: FC<TaskFormProps> = ({ handleClose }) => {
	const [loading, setLoading] = useState(false)

	const taskForm = useForm<TaskFormSchema>({
		resolver: zodResolver(TasksValidation.taskFormSchema),
		defaultValues: {
			title: '',
			description: null,
			parentTaskId: null,
			expiresAt: null,
			folderId: null,
		},
	})

	const onSubmit = async (values: TaskFormSchema) => {
		console.log(values)
		const payload: TaskBaseDto = {
			...values,
			completed: false,
			expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
		}
		console.log(payload)

		try {
			setLoading(true)
			const response = await TasksService.createTask(payload)
			const { success, error, message } = response

			if (success) {
				toast.success('Task successfully created')
				handleClose()
			}

			if (error) toast.error(message)
		} catch (error) {
			toast.error('Something went wrong!')
			console.error(`Error while creating a task: ${error}`)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Form {...taskForm}>
			<form onSubmit={taskForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					<FormField
						control={taskForm.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Title of the task'
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={taskForm.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										className='resize-none'
										placeholder='Add some description'
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={taskForm.control}
						name='expiresAt'
						render={({ field }) => (
							<FormItem className='flex flex-col gap-1'>
								<FormLabel>Set date</FormLabel>
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
						<span>Create task</span>
					</LoadingButton>
				</div>
			</form>
		</Form>
	)
}

export default TaskForm
