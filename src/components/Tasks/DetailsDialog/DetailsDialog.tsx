'use client'

import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

import TasksAPI from '@/api/tasks.api'
import DeleteDialog from '@/components/DeleteDialog'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import fetchFolders from '@/hooks/folders/useFetch'
import useActions from '@/hooks/tasks/useActions'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { IGetTasksResponse, TTask } from '@/types/tasks'
import { formatDate, formatValue } from '@/utils/formatting'

import InfoBlock from './components/InfoBlock'
import Subtasks from './components/Subtasks'

const DetailsDialog = () => {
	const queryClient = useQueryClient()
	const { data } = fetchFolders({ page: 1, limit: 25 })
	const { folders } = data ?? {}

	const open = useAppStore(s => s.taskDialogSettings.open)
	const task = useAppStore(s => s.taskDialogSettings.task)
	const updateDialogTask = useAppStore(s => s.updateDialogTask)
	const openTaskEditor = useAppStore(s => s.openTaskEditor)
	const closeTaskDialog = useAppStore(s => s.closeTaskDialog)

	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState<TResponseState>('default')

	const { handleTaskAction: changeStatus } = useActions('changeStatus', task as TTask)

	const { handleTaskAction: deleteTask } = useActions('delete', task as TTask)

	if (!task) return null

	const {
		title,
		description,
		completed,
		startDate,
		folderId,
		expiresDate,
		subtasks,
		parentTaskId,
	} = task

	const openPrevTask = async () => {
		if (!parentTaskId) return

		setLoading(true)

		const queryKey = ['tasks', JSON.stringify({ limit: 1, page: 1, taskId: parentTaskId })]

		let parentTaskData = queryClient.getQueryData<IGetTasksResponse>(queryKey)

		if (!parentTaskData) {
			try {
				parentTaskData = await queryClient.fetchQuery<IGetTasksResponse>({
					queryKey,
					queryFn: () => TasksAPI.getTasks({ limit: 1, page: 1, taskId: parentTaskId }),
				})
			} catch (error) {
				console.error('Error fetching parent task:', error)
				return
			}
		}

		const parentTask = parentTaskData?.tasks?.[0]

		if (parentTask) {
			updateDialogTask(parentTask)
		}

		setLoading(false)
	}

	const taskFolder = folders?.find(folder => folder.id === folderId)

	return (
		<Dialog
			open={open}
			onOpenChange={closeTaskDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title || 'Task title'}</DialogTitle>
				</DialogHeader>

				<div className='flex flex-col gap-3 pt-4'>
					<InfoBlock label='Description:'>
						<DialogDescription className='text-current'>
							{description || 'No description provided.'}
						</DialogDescription>
					</InfoBlock>

					<div
						role='group'
						aria-labelledby='status-label'
						className='flex flex-col gap-2'>
						<h4 className='text-muted-foreground'>Status:</h4>
						<div className='flex items-center space-x-2'>
							<Switch
								id='task-status'
								checked={completed}
								disabled={status === 'pending'}
								onCheckedChange={() => changeStatus(setStatus)}
							/>
							<Label
								htmlFor='task-status'
								className='text-base cursor-pointer'>
								{completed ? 'Completed' : 'In Progress'}
							</Label>
						</div>
					</div>

					{startDate && (
						<InfoBlock label='Start date:'>
							<span>{formatDate(startDate)}</span>
						</InfoBlock>
					)}

					{expiresDate && (
						<InfoBlock label='Expires date:'>
							<span>{formatDate(expiresDate)}</span>
						</InfoBlock>
					)}

					{folderId && (
						<InfoBlock label='Folder:'>
							<span>{formatValue(taskFolder?.name)}</span>
						</InfoBlock>
					)}

					{subtasks?.length > 0 && (
						<InfoBlock label='Subtasks:'>
							<Subtasks subtasks={subtasks} />
						</InfoBlock>
					)}
				</div>

				<DialogFooter className='gap-2 sm:space-x-0'>
					{parentTaskId && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										disabled={loading}
										onClick={openPrevTask}
										className={buttonVariants({
											variant: 'outline',
											size: 'icon',
											className: 'text-primary',
										})}>
										<ChevronLeft />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Go to parent task</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
					<Button
						variant='outline'
						onClick={() => openTaskEditor('create', task)}>
						Add subtask
					</Button>
					<Button
						variant='outline'
						onClick={() => openTaskEditor('edit', task)}>
						Edit
					</Button>
					<DeleteDialog
						handleDelete={() => deleteTask(setStatus)}
						loading={status === 'pending'}
						needTrigger
						deleteTarget='task'
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DetailsDialog
