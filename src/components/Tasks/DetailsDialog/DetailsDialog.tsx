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
import { Label } from '@/components/ui/label'
import { formatDate, formatValue } from '@/utils/formatting'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { TTask } from '@/types/tasks'
import useTaskActions from '@/hooks/useTaskActions'

const DetailsDialog = () => {
	const taskDialogSettings = useAppStore((state) => state.taskDialogSettings)
	const closeTaskDialog = useAppStore((state) => state.closeTaskDialog)
	const folders = useAppStore((state) => state.accountInfo?.folders)
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)

	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)

	const { open, task } = taskDialogSettings
	const { title, description, completed, startDate, folderId, expiresDate } =
		task || {}
	const folder = folders?.find((f) => f.id === folderId) ?? null

	const { handleTaskAction: chengeTaskStatus } = useTaskActions(
		'changeStatus',
		task as TTask
	)
	const { handleTaskAction: deleteTask } = useTaskActions(
		'delete',
		task as TTask
	)

	return (
		<Dialog
			open={open}
			onOpenChange={closeTaskDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title ?? 'Task title'}</DialogTitle>
				</DialogHeader>

				<div className='flex flex-col gap-3 pt-4'>
					<div className='flex flex-col gap-1'>
						<p className='text-muted-foreground'>Description:</p>
						<DialogDescription className='text-current'>
							{description || 'No description provided.'}
						</DialogDescription>
					</div>

					<div
						role='group'
						aria-labelledby='status-label'
						className='flex flex-col gap-2'>
						<Label
							htmlFor='status-label'
							className='text-muted-foreground'>
							Status:
						</Label>
						<Select
							disabled={toggling}
							onValueChange={() => chengeTaskStatus(setToggling)}
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
						<div className='flex flex-col gap-1'>
							<Label
								htmlFor='startDate'
								className='text-muted-foreground'>
								Start date:
							</Label>
							<span id='startDate'>{formatDate(startDate)}</span>
						</div>
					)}

					{expiresDate && (
						<div className='flex flex-col gap-1'>
							<Label
								htmlFor='expiresDate'
								className='text-muted-foreground'>
								Expires date:
							</Label>
							<span id='expiresDate'>{formatDate(expiresDate)}</span>
						</div>
					)}

					{folderId && (
						<div className='flex flex-col gap-1'>
							<Label
								htmlFor='folder'
								className='text-muted-foreground'>
								Folder:
							</Label>
							<span id='folder'>{formatValue(folder?.name)}</span>
						</div>
					)}
				</div>

				<DialogFooter className='gap-2 sm:space-x-0'>
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
						handleDelete={() => deleteTask(setDeleting)}
						loading={deleting}
						// disabled={deleting === 'success'}
						needTrigger
						deleteTarget='task'
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DetailsDialog
