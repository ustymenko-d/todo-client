import { Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { queryClient } from '@/components/providers/Query.provider'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import AuthService from '@/services/auth.service'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'

const LogoutButton = () => {
	const router = useRouter()

	const setIsAuthorized = useAppStore((s) => s.setIsAuthorized)

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
			setIsAuthorized(false)
			queryClient.clear()

			toast.success(message)

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
