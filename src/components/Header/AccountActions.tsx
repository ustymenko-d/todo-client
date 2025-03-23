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
import { BadgeAlert, BadgeCheck, CircleUser, LogOut } from 'lucide-react'
import useAppStore from '@/store/store'
import useBreakpoints from '@/hooks/useBreakpoints'
import { IUserInfo } from '@/store/slices/auth'

type ActionResponse = {
	success: boolean
	message?: string
}

type ActionCallback = () => Promise<ActionResponse>

const AccountActions = () => {
	const router = useRouter()
	const breakpoints = useBreakpoints([639])
	const [loading, setLoading] = useState(false)
	const userInfo = useAppStore((state) => state.userInfo)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const setUserInfo = useAppStore((state) => state.setUserInfo)
	const { email, username, isVerified } = userInfo as IUserInfo

	const handleAction = async (
		actionCallback: ActionCallback
	): Promise<void> => {
		try {
			setLoading(true)
			const { success, message } = await actionCallback()

			if (success) {
				setIsAuthorized(false)
				setUserInfo(null)
				toast.success(message)
				router.replace('/')
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
						<DialogTitle className='text-xl'>{username}</DialogTitle>
					</DialogHeader>

					<div>
						<div className='flex items-center gap-2 mb-2'>
							<p className='text-lg font-medium'>
								{isVerified
									? 'Your account has been successfully verified'
									: 'Your account has not been verified'}
							</p>
							{isVerified ? (
								<BadgeCheck
									strokeWidth={1.5}
									className='w-5 h-5'
								/>
							) : (
								<BadgeAlert
									strokeWidth={1.5}
									className='w-5 h-5'
								/>
							)}
						</div>
						{!isVerified && (
							<>
								<p className='mb-1'>
									Please check the email address provided during registration (
									{email}) for verification. If you don’t verify your email within a week, your account will be deleted.
								</p>
								<p className='font-normal text-muted-foreground'>
									Restrictions: unverified users cannot create more than 10
									tasks and more than 3 folders
								</p>
							</>
						)}
					</div>

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
									<AlertDialogAction
										className='shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90'
										onClick={handleDeleteAccount}>
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
