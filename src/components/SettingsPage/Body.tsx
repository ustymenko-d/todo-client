'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import UnverifiedInfo from './components/UnverifiedInfo'
import VerificationBadge from './components/VerificationBadge'
import { Separator } from '@/components/ui/separator'
import DeleteDialog from '../DeleteDialog'
import AuthService from '@/services/auth.service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import UserInfoRow from './components/UserInfoRow'

const Body = () => {
	const router = useRouter()

	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)

	const [openAlert, setOpenAlert] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleDeleteAccount = async (): Promise<void> => {
		setLoading(true)
		try {
			const { data } = await AuthService.deleteAccount()
			const { success, message } = data

			if (success) {
				setAccountInfo(null)
				if (!authHydrated) setAuthHydrated(true)
				toast.success(message)
				router.push('/')
			}
		} catch (error) {
			console.error('Delete account error:', error)
			toast.error('Something went wrong!')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className='flex flex-col gap-2 pt-4'>
				<UserInfoRow
					label='Username:'
					htmlFor='username'>
					<span id='username'>{accountInfo?.username}</span>
				</UserInfoRow>

				<UserInfoRow
					label='Email:'
					htmlFor='email'>
					<div className='flex items-center gap-2'>
						<span id='email'>{accountInfo?.email}</span>
						<VerificationBadge />
					</div>
				</UserInfoRow>

				{!accountInfo?.isVerified && <UnverifiedInfo />}

				<h2 className='text-xl font-semibold text-red-600'>Delete account</h2>
				<Separator />
				<p>
					Once you delete your account, there is no going back. Please be
					certain.
				</p>
				<Button
					variant='destructive'
					disabled={loading}
					className='flex items-center gap-1 w-fit'
					onClick={() => setOpenAlert(true)}>
					{loading && (
						<Loader2
							strokeWidth={1.5}
							className='animate-spin'
						/>
					)}
					Delete your account
				</Button>
			</div>

			<DeleteDialog
				handleDelete={handleDeleteAccount}
				loading={loading}
				deleteTarget='account'
				open={openAlert}
				onOpenChange={setOpenAlert}
			/>
		</>
	)
}

export default Body
