import { useState } from 'react'
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
import DatePicker from '@/components/Tasks/Editor/components/DatePicker/DatePicker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/ui/LoadingButton'
import Field from '@/components/Tasks/Editor/components/Field'
import FormSelect from '@/components/Tasks/Editor/components/FormSelect'
import { TTask, TTaskBase } from '@/types/tasks'
import useTaskActions from '@/hooks/useTaskActions'

const EditorForm = () => {
	const mode = useAppStore((state) => state.taskEditorSettings.mode)
	const selectedTask = useAppStore((state) => state.taskEditorSettings.target)

	const [loading, setLoading] = useState(false)
	const isEditing = mode === 'edit'

	const { handleTaskAction: createTask } = useTaskActions('create')
	const { handleTaskAction: editTask } = useTaskActions(
		'edit',
		selectedTask as TTask
	)

	const taskForm = useForm<TTaskBase>({
		resolver: zodResolver(TasksValidation.taskBase),
		defaultValues: {
			title: isEditing ? selectedTask?.title : '',
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
			editTask(setLoading, editPayload)
		} else {
			createTask(setLoading, payload)
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
					/>

					<div className='grid sm:grid-cols-2 gap-3'>
						{['startDate', 'expiresDate'].map((name) => (
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

export default EditorForm
