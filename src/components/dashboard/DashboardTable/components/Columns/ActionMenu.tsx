import { useCallback, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
import useAppStore from '@/store/store'
import { Row } from '@tanstack/react-table'
import TasksService from '@/services/Axios/tasks.service'

const Actions = ({ row }: { row: Row<TaskDto> }) => {
	const task = row.original
	const router = useRouter()
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const setTaskEditorSettings = useAppStore(
		(state) => state.setTaskEditorSettings
	)

	const openTaskEditor = useCallback(
		(mode: 'edit' | 'create') => {
			setTaskEditorSettings({ open: true, mode, selectedTask: task })
		},
		[setTaskEditorSettings, task]
	)

	const handleTaskAction = useCallback(
		async (action: 'delete' | 'toggleStatus') => {
			try {
				setLoading(true)

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
				setLoading(false)
			}
		},
		[task.id, pathname, router]
	)

	return (
		<DropdownMenu
			open={menuOpen}
			onOpenChange={setMenuOpen}>
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
				<DropdownMenuItem onClick={() => openTaskEditor('edit')}>
					Edit task
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => openTaskEditor('create')}>
					Add Subtask
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleTaskAction('toggleStatus')}>
					Toggle status
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<AlertDialog onOpenChange={setMenuOpen}>
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
							<AlertDialogAction
								className='bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
								onClick={() => handleTaskAction('delete')}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default Actions
