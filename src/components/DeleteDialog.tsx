import { ComponentProps } from 'react'
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
import LoadingButton from '@/components/ui/LoadingButton'

interface DeleteDialogProps extends ComponentProps<typeof AlertDialog> {
	handleDelete: () => void
	loading: boolean
	disabled?: boolean
	needTrigger?: boolean
}

const DeleteDialog = ({
	handleDelete,
	loading,
	disabled,
	needTrigger,
	...props
}: DeleteDialogProps) => (
	<AlertDialog {...props}>
		{needTrigger && (
			<AlertDialogTrigger asChild>
				<LoadingButton
					loading={loading}
					disabled={disabled}
					variant='destructive'>
					Delete
				</LoadingButton>
			</AlertDialogTrigger>
		)}
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					Are you sure you want to delete this task?
				</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete your task.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction
					asChild
					onClick={handleDelete}>
					<LoadingButton
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						loading={loading}
						variant='destructive'>
						Delete
					</LoadingButton>
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
)

export default DeleteDialog
