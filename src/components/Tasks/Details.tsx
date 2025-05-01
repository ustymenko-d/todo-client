'use client'

import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useCallback, useMemo, useState } from 'react'
import useAppStore from '@/store/store'
import { toast } from 'sonner'
import TasksService from '@/services/tasks.service'
import { usePathname, useRouter } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import DeleteDialog from '../DeleteDialog'
import { formatDate, formatValue } from '@/utils/formatting'
import { TTask } from '@/types/tasks'
import { IFolder } from '@/types/folders'

const Details = ({ task }: { task: TTask }) => {
	const router = useRouter()
	const pathname = usePathname()
	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)
	const folders = useAppStore((state) => state.accountInfo?.folders)
	const { title, description, completed, startDate, folderId, expiresDate } =
		task

	const folder: IFolder | null = useMemo(
		() => folders?.find((f) => f.id === folderId) ?? null,
		[folders, folderId]
	)

	const handleTaskAction = useCallback(
		async (action: 'delete' | 'toggleStatus') => {
			const deleteAction = action === 'delete'
			try {
				if (deleteAction) {
					setDeleting(true)
				} else setToggling(true)

				const actionFn =
					action === 'delete'
						? TasksService.deleteTask
						: TasksService.toggleStatus

				const { data } = await actionFn(task.id)

				if (data.success) {
					toast.success(
						action === 'delete'
							? 'Task successfully deleted'
							: 'Task status successfully changed'
					)

					if (pathname === '/table') {
						router.push(`?page=1&limit=25`)
					}
				} else {
					toast.error('Something went wrong!')
				}
			} catch (error) {
				console.error(`Error while performing task action: ${action}`, error)
				toast.error('Something went wrong!')
			} finally {
				if (deleteAction) {
					setDeleting(false)
				} else setToggling(false)
			}
		},
		[task.id, pathname, router]
	)

	return (
		<DialogContent aria-describedby='task-description'>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>

			<div className='pt-4 flex flex-col gap-3'>
				<div className='flex flex-col gap-1'>
					<Label className='text-muted-foreground'>Description:</Label>
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
						onValueChange={() => handleTaskAction('toggleStatus')}
						value={completed ? 'completed' : 'in-progress'}>
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
									value='in-progress'>
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
					handleDelete={() => handleTaskAction('delete')}
					loading={deleting}
					needTrigger
					deleteTarget='task'
				/>
			</DialogFooter>
		</DialogContent>
	)
}

export default Details
