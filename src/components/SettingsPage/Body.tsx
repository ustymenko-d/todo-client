'use client'

import { Label } from '@/components/ui/label'
import useAppStore from '@/store/store'
import UnverifiedInfo from './components/UnverifiedInfo'
import VerificationBadge from './components/VerificationBadge'
import { Separator } from '@/components/ui/separator'
import DeleteDialog from '../DeleteDialog'
import AuthService from '@/services/auth.service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const Body = () => {
	const router = useRouter()
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)
	const [openAlert, setOpenAlert] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const handleDeleteAccount = async (): Promise<void> => {
		try {
			setLoading(true)
			const { data } = await AuthService.deleteAccount()
			const { success, message } = data
			if (success) {
				setIsAuthorized(false)
				setAccountInfo(null)
				if (!authHydrated) setAuthHydrated(true)
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
		<div className='flex flex-col gap-2 pt-4'>
			<div className='flex flex-col'>
				<Label
					htmlFor='account-email'
					className='text-muted-foreground'>
					Username:
				</Label>
				<span id='account-email'>{accountInfo?.username}</span>
			</div>

			<div className='flex flex-col'>
				<Label
					htmlFor='account-email'
					className='text-muted-foreground'>
					Email:
				</Label>
				<div className='flex gap-2 items-center'>
					<span id='account-email'>{accountInfo?.email}</span>
					<VerificationBadge />
				</div>
			</div>

			{!accountInfo?.isVerified && <UnverifiedInfo />}

			<h2 className='text-red-600 font-semibold text-xl'>Delete account</h2>
			<Separator />
			<p>
				Once you delete your account, there is no going back. Please be certain.
			</p>
			<Button
				variant='destructive'
				disabled={loading}
				className='w-fit flex gap-1 items-center'
				onClick={() => setOpenAlert(true)}>
				{loading && (
					<Loader2
						strokeWidth={1.5}
						className='animate-spin'
					/>
				)}
				Delete your account
			</Button>

			<DeleteDialog
				handleDelete={handleDeleteAccount}
				loading={loading}
				deleteTarget='account'
				open={openAlert}
				onOpenChange={setOpenAlert}
			/>
		</div>
	)
}

export default Body
