'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
import { toast } from 'sonner'
import FormDatePicker from '@/components/Tasks/Editor/compoonents/FormDatePicker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/ui/LoadingButton'
import TasksService from '@/services/tasks.service'
import Field from '@/components/Tasks/Editor/compoonents/Field'
import FormSelect from '@/components/Tasks/Editor/compoonents/FormSelect'
import { TTask, TTaskBase, TTaskPayload } from '@/types/tasks'
import { TResponseState } from '@/types/common'

const TaskForm = () => {
	const router = useRouter()
	const pathname = usePathname()
	const mode = useAppStore((state) => state.taskEditorSettings.mode)
	const selectedTask = useAppStore((state) => state.taskEditorSettings.target)
	const closeTaskEditor = useAppStore((state) => state.closeTaskEditor)

	const [status, setStatus] = useState<TResponseState>('default')
	const isEditing = mode === 'edit'

	const defaultValues = useMemo<TTaskPayload>(
		() => ({
			title: isEditing ? selectedTask?.title || '' : '',
			description: isEditing ? selectedTask?.description || '' : '',
			parentTaskId: isEditing
				? selectedTask?.parentTaskId
				: selectedTask?.id || null,
			expiresAt:
				isEditing && selectedTask?.expiresAt
					? new Date(selectedTask.expiresAt)
					: null,
			folderId: isEditing ? selectedTask?.folderId || null : null,
		}),
		[isEditing, selectedTask]
	)

	const taskForm = useForm<TTaskPayload>({
		resolver: zodResolver(TasksValidation.taskPayload),
		defaultValues,
	})

	const createPayload = (values: TTaskPayload): TTaskBase | TTask => {
		const base: TTaskBase = {
			...values,
			completed: !isEditing ? false : selectedTask?.completed ?? false,
			expiresAt: values.expiresAt ? new Date(values.expiresAt) : null,
		}
		const payload = { ...selectedTask, ...base }
		delete payload.subtasks
		return payload
	}

	const handleSubmit = async (values: TTaskPayload) => {
		try {
			setStatus('pending')
			const payload = createPayload(values)
			const { data } =
				mode === 'create'
					? await TasksService.createTask(payload)
					: await TasksService.editTask(payload)

			const { success } = data

			if (success) {
				setStatus('success')
				toast.success(
					mode === 'create'
						? 'Task successfully created'
						: 'Task successfully edited'
				)
				closeTaskEditor()
				if (pathname === '/dashboard') router.refresh()
			} else {
				toast.error('Failed to process task')
			}
		} catch (error) {
			console.error(`Error while processing a task: ${error}`)
			toast.error('Something went wrong!')
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
							name='expiresAt'
							render={({ field }) => (
								<FormItem className='flex flex-col gap-1'>
									<FormLabel className='text-muted-foreground'>
										Set expires date:
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
							name='folderId'
							render={({ field }) => (
								<FormItem className='flex flex-col gap-1'>
									<FormLabel className='text-muted-foreground'>
										Folder:
									</FormLabel>
									<FormSelect field={field} />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<LoadingButton
						loading={status === 'pending'}
						disabled={status === 'success'}
						type='submit'>
						<span>{mode === 'create' ? 'Create task' : 'Edit task'}</span>
					</LoadingButton>
				</div>
			</form>
		</Form>
	)
}

export default TaskForm
