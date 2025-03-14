'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import TasksService from '@/services/api/tasks'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/ui/LoadingButton'
import { MoreHorizontal } from 'lucide-react'
import { TaskDto } from '@/dto/tasks'

const ActionMenu = ({ task }: { task: TaskDto }) => {
	const router = useRouter()
	const pathname = usePathname()
	const [open, setOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const handleTaskAction = async (action: 'delete' | 'toggleStatus') => {
		try {
			setLoading(true)
			const actionMap = {
				delete: TasksService.deleteTask,
				toggleStatus: TasksService.toggleStatus,
			}

			const { success } = await actionMap[action](task.id)

			if (success) {
				toast.success(
					action === 'delete'
						? 'Task successfully deleted'
						: 'Task status successfully changed'
				)

				if (pathname === '/dashboard') router.push(`?page=1&limit=5`)
			} else {
				toast.error('Something went wrong!')
			}
		} catch {
			toast.error('Something went wrong!')
			console.error(`Error while performing task action: ${action}`)
		} finally {
			setLoading(false)
		}
	}

	return (
		<DropdownMenu
			open={open}
			onOpenChange={setOpen}>
			<DropdownMenuTrigger
				asChild
				className='flex ml-auto'>
				<Button
					variant='ghost'
					className='w-8 h-8 p-0'>
					<span className='sr-only'>Open menu</span>
					<MoreHorizontal className='w-4 h-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem disabled>Edit</DropdownMenuItem>
				<DropdownMenuItem disabled>Add Subtask</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleTaskAction('toggleStatus')}>
					Toggle status
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<AlertDialog onOpenChange={setOpen}>
					<AlertDialogTrigger asChild>
						<LoadingButton
							loading={loading}
							variant='ghost'
							className='w-full px-2 py-1.5 justify-start'>
							Delete
						</LoadingButton>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure you want to delete this task?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								task.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => handleTaskAction('delete')}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ActionMenu
