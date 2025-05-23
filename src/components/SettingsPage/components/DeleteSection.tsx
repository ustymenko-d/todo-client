import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DeleteDialog from '@/components/DeleteDialog'
import { Loader2 } from 'lucide-react'
import { TResponseState } from '@/types/common'

const DeleteSection = () => {
	const router = useRouter()
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)

	const [openAlert, setOpenAlert] = useState(false)
	const [loading, setLoading] = useState<TResponseState>('default')

	const handleDeleteAccount = async () => {
		setLoading('pending')
		try {
			const { data } = await AuthService.deleteAccount()
			const { success, message } = data

			if (!success) {
				setLoading('error')
				return
			}

			setLoading('success')
			setAccountInfo(null)
			if (!authHydrated) setAuthHydrated(true)
			toast.success(message)
			router.push('/')
		} catch (error) {
			setLoading('error')
			console.error('Delete account error:', error)
			toast.error('Something went wrong!')
		}
	}

	return (
		<>
			<h2 className='text-xl font-semibold text-red-600'>Delete account</h2>
			<Separator />
			<p className='mb-2'>
				Once you delete your account, there is no going back. Please be certain.
			</p>
			<Button
				variant='destructive'
				disabled={loading === 'pending' || loading === 'success'}
				className='flex items-center gap-1 w-fit'
				onClick={() => setOpenAlert(true)}>
				{loading === 'pending' && (
					<Loader2
						strokeWidth={1.5}
						className='animate-spin'
					/>
				)}
				Delete your account
			</Button>

			<DeleteDialog
				handleDelete={handleDeleteAccount}
				loading={loading === 'pending'}
				disabled={loading === 'success'}
				deleteTarget='account'
				open={openAlert}
				onOpenChange={setOpenAlert}
			/>
		</>
	)
}

export default DeleteSection
