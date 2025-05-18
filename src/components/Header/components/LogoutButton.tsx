import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Loader2, LogOut } from 'lucide-react'
import { TResponseState } from '@/types/common'
import { cn } from '@/lib/utils'

const LogoutButton = () => {
	const router = useRouter()

	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)

	const [loading, setLoading] = useState<TResponseState>('default')

	const iconClasses = '!w-5 !h-5 opacity-60'

	const handleLogout = async () => {
		try {
			setLoading('pending')
			const { data } = await AuthService.logout()
			const { success, message } = data

			if (!success) {
				setLoading('error')
				toast.error(message || 'Error during logout!')
				return
			}

			setLoading('success')
			toast.success(message)
			setAccountInfo(null)
			if (!authHydrated) setAuthHydrated(true)
			router.push('/')
		} catch (error) {
			setLoading('error')
			toast.error('Error during logout!')
			console.error('Error:', error)
		}
	}

	return (
		<DropdownMenuItem
			disabled={loading === 'pending' || loading === 'success'}
			onClick={handleLogout}
			className='flex items-center gap-2'>
			{loading === 'pending' ? (
				<Loader2
					strokeWidth={1.5}
					className={cn(iconClasses, 'animate-spin')}
				/>
			) : (
				<LogOut
					strokeWidth={1.5}
					className={cn(iconClasses)}
				/>
			)}
			Log out
		</DropdownMenuItem>
	)
}

export default LogoutButton
