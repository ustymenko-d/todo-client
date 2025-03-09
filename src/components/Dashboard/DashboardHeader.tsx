'use client'

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { CircleUser, LogOut } from 'lucide-react'
import { useState } from 'react'
import TokenService from '@/utils/token'
import AuthService from '@/services/api/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
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
} from '../ui/alert-dialog'
import LoadingButton from '../ui/LoadingButton'

type ActionResponse = {
	success: boolean
	message?: string
}
type ActionCallback = () => Promise<ActionResponse>

const DashboardHeader = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleAction = async (
		actionCallback: ActionCallback,
		successMessage: string
	): Promise<void> => {
		try {
			setLoading(true)
			const { success } = await actionCallback()

			if (success) {
				TokenService.removeStorageToken()
				toast.info(successMessage)
				router.push('/')
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error('Error:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteAccount = () =>
		handleAction(
			AuthService.deleteAccount as ActionCallback,
			'Your account has been deleted'
		)

	const handleLogout = () =>
		handleAction(
			AuthService.logout as ActionCallback,
			'You have been logged out'
		)

	return (
		<div className='flex flex-wrap items-center justify-between gap-4'>
			<div className='flex flex-col'>
				<h1 className='text-2xl font-bold tracking-tight'>Welcome back!</h1>
				<p className='text-base text-muted-foreground'>
					Here&apos;s a list of your tasks
				</p>
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='outline'>
							<CircleUser />
							<span className='hidden sm:block'>Account</span>
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Account settings</DialogTitle>
						</DialogHeader>

						<DialogFooter>
							<Button
								variant='outline'
								disabled>
								Edit
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<LoadingButton
										loading={loading}
										variant='destructive'>
										<span className='hidden sm:block'>Delete account</span>
									</LoadingButton>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure you want to delete your account?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete
											your account and remove your data from our servers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={handleDeleteAccount}>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<LoadingButton
					loading={loading}
					variant='outline'
					onClick={handleLogout}>
					<LogOut />
					<span className='hidden sm:block'>Log out</span>
				</LoadingButton>
			</div>
		</div>
	)
}

export default DashboardHeader
