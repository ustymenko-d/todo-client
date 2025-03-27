'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/services/api/auth'
import useAppStore from '@/store/store'
import useBreakpoints from '@/hooks/useBreakpoints'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'
import AccountDialogContent from './components/AccountDialogContent'
import LoadingButton from '../ui/LoadingButton'
import { CircleUser, LogOut } from 'lucide-react'

const AccountActions = () => {
	const router = useRouter()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const breakpoints = useBreakpoints([639])
	const [loading, setLoading] = useState(false)

	const handleAction = async (action: 'delete' | 'logout'): Promise<void> => {
		setLoading(true)
		try {
			const actionMap = {
				delete: AuthService.deleteAccount,
				logout: AuthService.logout,
			}

			const { success, message } = await actionMap[action]()

			if (success) {
				setIsAuthorized(false)
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

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant='outline'
						size={breakpoints ? 'default' : 'icon'}>
						<CircleUser />
						{breakpoints && <span className='hidden sm:block'>Account</span>}
					</Button>
				</DialogTrigger>
				<AccountDialogContent
					loading={loading}
					action={() => handleAction('delete')}
				/>
			</Dialog>

			<LoadingButton
				variant='outline'
				loading={loading}
				disabled={!isAuthorized}
				onClick={() => handleAction('logout')}
				size={breakpoints ? 'default' : 'icon'}>
				<LogOut />
				{breakpoints && <span className='hidden sm:block'>Log out</span>}
			</LoadingButton>
		</div>
	)
}

export default AccountActions
