'use client'

import { Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import AuthAPI from '@/api/auth.api'
import { queryClient } from '@/components/providers/Query.provider'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'

const LogoutButton = () => {
	const router = useRouter()

	const setIsAuthorized = useAppStore((s) => s.setIsAuthorized)

	const [status, setStatus] = useState<TResponseState>('default')

	const handleLogout = async () => {
		setStatus('pending')

		try {
			const { success, message } = await AuthAPI.logout()

			if (!success) throw new Error(message ?? 'Error during logout')

			setStatus('success')
			setIsAuthorized(false)
			queryClient.clear()

			toast.success(message)

			router.push('/')
		} catch (error) {
			setStatus('error')
			console.error('Logout failed:', error)
		}
	}

	return (
		<DropdownMenuItem
			disabled={status === 'pending' || status === 'success'}
			onClick={handleLogout}
			className='flex items-center gap-2'>
			{status === 'pending' ? (
				<Loader2
					strokeWidth={1.5}
					className={cn('!w-5 !h-5 opacity-60', 'animate-spin')}
				/>
			) : (
				<LogOut
					strokeWidth={1.5}
					className={cn('!w-5 !h-5 opacity-60')}
				/>
			)}
			Log out
		</DropdownMenuItem>
	)
}

export default LogoutButton
