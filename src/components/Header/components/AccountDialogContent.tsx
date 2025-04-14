'use client'

import {
	DialogContent,
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
import VerificationBadge from './VerificationBadge'
import UnverifiedInfo from './UnverifiedInfo'

const AccountDialogContent = ({
	loading,
	action,
}: {
	loading: boolean
	action: () => void
}) => {
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)

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
			</DialogHeader>
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
								onClick={action}>
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
