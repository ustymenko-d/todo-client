'use client'

import useAppStore from '@/store/store'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import DeleteDialog from '@/components/DeleteDialog'
import { formatDate, formatValue } from '@/utils/formatting'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { TTask } from '@/types/tasks'
import useTaskActions from '@/hooks/useTaskActions'
import InfoBlock from './components/InfoBlock'

const DetailsDialog = () => {
	const taskDialogSettings = useAppStore((state) => state.taskDialogSettings)
	const closeTaskDialog = useAppStore((state) => state.closeTaskDialog)
	const allFolders = useAppStore((state) => state.foldersWithTasks)
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)

	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)

	const { open, task } = taskDialogSettings
	const { title, description, completed, startDate, folderId, expiresDate } =
		task || {}
	const taskFolder = allFolders.find((folder) => folder.id === folderId)

	const { handleTaskAction: changeTaskStatus } = useTaskActions(
		'changeStatus',
		task as TTask
	)
	const { handleTaskAction: deleteTask } = useTaskActions(
		'delete',
		task as TTask
	)

	const handleStatusChange = () => changeTaskStatus(setToggling)
	const handleEdit = () => openTaskEditor('edit', task)
	const handleAddSubtask = () => openTaskEditor('create', task)
	const handleDelete = () => deleteTask(setDeleting)

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
						<Select
							disabled={toggling}
							onValueChange={handleStatusChange}
							value={completed ? 'completed' : 'in-process'}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem
										disabled={completed}
										value='completed'>
										Completed
									</SelectItem>

									<SelectItem
										disabled={!completed}
										value='in-process'>
										In Process
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
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
				</div>

				<DialogFooter className='gap-2 sm:space-x-0'>
					<Button
						variant='outline'
						onClick={handleAddSubtask}>
						Add subtask
					</Button>
					<Button
						variant='outline'
						onClick={handleEdit}>
						Edit
					</Button>
					<DeleteDialog
						handleDelete={handleDelete}
						loading={deleting}
						needTrigger
						deleteTarget='task'
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DetailsDialog
