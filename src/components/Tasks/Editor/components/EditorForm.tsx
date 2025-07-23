'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { ControllerRenderProps, useForm } from 'react-hook-form'

import DatePicker from '@/components/Tasks/Editor/components/DatePicker/DatePicker'
import Field from '@/components/Tasks/Editor/components/Field'
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
import useActions from '@/hooks/tasks/useActions'
import useIsTouchDevice from '@/hooks/useIsTouchDevice'
import TasksValidation from '@/schemas/tasks.schema'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { TTask, TTaskBase } from '@/types/tasks'

import DesktopFolderSelect from './FolderSelect/DesktopFolderSelect'
import MobileFolderSelect from './FolderSelect/MobileFolderSelect'

export interface IFolderSelectProps {
	field: ControllerRenderProps<TTaskBase, 'folderId'>
}

const EditorForm = () => {
	const mode = useAppStore(s => s.taskEditorSettings.mode)
	const selectedTask = useAppStore(s => s.taskEditorSettings.target)

	const isTouchDevice = useIsTouchDevice()

	const { handleTaskAction: createTask } = useActions('create')
	const { handleTaskAction: editTask } = useActions('edit', selectedTask as TTask)

	const [status, setStatus] = useState<TResponseState>('default')

	const isEditing = mode === 'edit'

	const taskForm = useForm<TTaskBase>({
		resolver: zodResolver(TasksValidation.taskBase),
		defaultValues: {
			title: isEditing ? selectedTask?.title : '',
			description: isEditing ? selectedTask?.description : '',
			parentTaskId: isEditing ? selectedTask?.parentTaskId : selectedTask?.id || null,
			startDate: isEditing && selectedTask?.startDate ? new Date(selectedTask.startDate) : null,
			expiresDate:
				isEditing && selectedTask?.expiresDate ? new Date(selectedTask.expiresDate) : null,
			folderId: selectedTask?.folderId ?? null,
		},
	})

	const onSubmit = async (values: TTaskBase) => {
		const payload: TTaskBase = {
			...values,
			completed: isEditing ? selectedTask?.completed : false,
			startDate: values.startDate ? new Date(values.startDate) : null,
			expiresDate: values.expiresDate ? new Date(values.expiresDate) : null,
		}

		if (isEditing) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { subtasks, lastEdited, ...editPayload } = {
				...selectedTask!,
				...payload,
			}
			editTask(setStatus, editPayload)
		} else {
			createTask(setStatus, payload)
		}
	}

	return (
		<Form {...taskForm}>
			<form onSubmit={taskForm.handleSubmit(onSubmit)}>
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
						className='max-h-40'
					/>

					<div className='grid gap-3 sm:grid-cols-2'>
						{['startDate', 'expiresDate'].map(name => (
							<FormField
								key={name}
								control={taskForm.control}
								name={name as 'startDate' | 'expiresDate'}
								render={({ field }) => (
									<FormItem className='flex flex-col gap-1'>
										<FormLabel className='text-muted-foreground'>
											{`${name === 'startDate' ? 'Start' : 'Expires'} date:`}
										</FormLabel>
										<FormControl>
											<DatePicker field={field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
					</div>

					<FormField
						control={taskForm.control}
						name='folderId'
						render={({ field }) => (
							<FormItem className='flex flex-col gap-1'>
								<FormLabel className='text-muted-foreground'>Folder:</FormLabel>
								{isTouchDevice ? (
									<MobileFolderSelect field={field} />
								) : (
									<DesktopFolderSelect field={field} />
								)}
								<FormMessage />
							</FormItem>
						)}
					/>

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

export default EditorForm
