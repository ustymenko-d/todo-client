'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/services/api/auth'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
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
import { CircleUser, LogOut } from 'lucide-react'
import useAppStore from '@/store/store'
import useBreakpoints from '@/hooks/useBreakpoints'

type ActionResponse = {
	success: boolean
	message?: string
}

type ActionCallback = () => Promise<ActionResponse>

const AccountActions = () => {
	const router = useRouter()
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const breakpoints = useBreakpoints([639])
	const [loading, setLoading] = useState(false)

	const handleAction = async (
		actionCallback: ActionCallback
	): Promise<void> => {
		try {
			setLoading(true)
			const { success, message } = await actionCallback()

			if (success) {
				setIsAuthorized(false)
				toast.success(message)
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
		handleAction(AuthService.deleteAccount as ActionCallback)

	const handleLogout = () => handleAction(AuthService.logout as ActionCallback)

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant='outline'
						size={!!breakpoints ? 'default' : 'icon'}>
						<CircleUser />
						{!!breakpoints && <span className='hidden sm:block'>Account</span>}
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
				onClick={handleLogout}
				size={!!breakpoints ? 'default' : 'icon'}>
				<LogOut />
				{!!breakpoints && <span className='hidden sm:block'>Log out</span>}
			</LoadingButton>
		</div>
	)
}

export default AccountActions
