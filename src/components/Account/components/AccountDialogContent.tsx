import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useAppStore from '@/store/store'
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
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import AuthService from '@/services/Axios/auth.service'
import { useRouter } from 'next/navigation'
import VerificationBadge from './VerificationBadge'
import UnverifiedInfo from './UnverifiedInfo'

const AccountDialogContent = () => {
	const router = useRouter()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const [loading, setLoading] = useState<boolean>(false)

	const handleDeleteAccount = async (): Promise<void> => {
		try {
			setLoading(true)
			const { data } = await AuthService.deleteAccount()
			const { success, message } = data
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

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className='flex gap-2 items-center'>
					{accountInfo?.username ? (
						<>
							<span>{accountInfo.username}</span>
							<VerificationBadge />
						</>
					) : (
						'Account settings'
					)}
				</DialogTitle>
				<DialogDescription>
					This dialog displays your account information. You can also delete the
					account using the &quot;Delete account&quot; button.
				</DialogDescription>
			</DialogHeader>

			<div className='flex flex-col'>
				<Label
					htmlFor='account-email'
					className='text-muted-foreground'>
					Email:
				</Label>
				<span id='account-email'>{accountInfo?.email}</span>
			</div>

			{!accountInfo?.isVerified && <UnverifiedInfo />}

			<DialogFooter>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<LoadingButton
							loading={loading}
							disabled={!isAuthorized}
							variant='destructive'>
							<span>Delete account</span>
						</LoadingButton>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure you want to delete your account?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
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
	)
}

export default AccountDialogContent
