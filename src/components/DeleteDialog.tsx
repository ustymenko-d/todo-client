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
import LoadingButton from './ui/LoadingButton'
import { ComponentProps } from 'react'

interface DeleteDialogProps extends ComponentProps<typeof AlertDialog> {
	handleDelete: () => void
	loading: boolean
	needTrigger?: boolean
}

const DeleteDialog = ({
	handleDelete,
	loading,
	needTrigger,
	...props
}: DeleteDialogProps) => {
	return (
		<AlertDialog {...props}>
			{needTrigger && (
				<AlertDialogTrigger asChild>
					<LoadingButton
						loading={loading}
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
						This action cannot be undone. This will permanently delete your
						task.
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
}

export default DeleteDialog
