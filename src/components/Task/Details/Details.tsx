'use client'

import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ITask } from '@/types/tasks'
import formatDate from '@/utils/formatDate'
import { Button } from '../../ui/button'
import { useCallback, useState } from 'react'
import useAppStore from '@/store/store'
import { toast } from 'sonner'
import TasksService from '@/services/Axios/tasks.service'
import { usePathname, useRouter } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '../../ui/label'
import DeleteDialog from '../DeleteDialog'

const Details = ({ task }: { task: ITask }) => {
	const router = useRouter()
	const pathname = usePathname()
	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)

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

					if (pathname === '/dashboard') {
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

	const { title, description, completed, createdAt, expiresAt } = task

	return (
		<DialogContent className='sm:max-w-[425px]'>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>

			<div className='pt-4 flex flex-col gap-3'>
				<div className='flex flex-col gap-1'>
					<Label
						htmlFor='description'
						className='text-muted-foreground'>
						Description:
					</Label>
					<p id='description'>{description}</p>
				</div>

				<div className='flex flex-col gap-1'>
					<Label
						htmlFor='createdAt'
						className='text-muted-foreground'>
						Created at:
					</Label>
					<span id='createdAt'>{formatDate(createdAt.toString())}</span>
				</div>

				{expiresAt && (
					<div className='flex flex-col gap-1'>
						<Label
							htmlFor='expiresAt'
							className='text-muted-foreground'>
							Expires at:
						</Label>
						<span id='expiresAt'>{formatDate(expiresAt.toString())}</span>
					</div>
				)}

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
								<SelectLabel>Status</SelectLabel>
								<SelectItem
									disabled={completed}
									value='completed'>
									Completed
								</SelectItem>

								<SelectItem
									disabled={!completed}
									value='in-progress'>
									In Progress
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			<DialogFooter>
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
				/>
			</DialogFooter>
		</DialogContent>
	)
}

export default Details
