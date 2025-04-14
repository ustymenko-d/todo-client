'use client'

import useAppStore from '@/store/store'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button, buttonVariants } from '../../ui/button'
import { ChevronLeft, CircleUser, Loader2, LogOut } from 'lucide-react'
import ThemeToggle from '../../theme/ThemeToggle'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import AccountDialogContent from './AccountDialogContent'
import { toast } from 'sonner'
import AuthService from '@/services/Axios/auth.service'

const Actions = () => {
	const router = useRouter()
	const pathname = usePathname()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const [loading, setLoading] = useState(false)

	const handleAction = async (action: 'delete' | 'logout'): Promise<void> => {
		setLoading(true)
		try {
			const actionMap = {
				delete: AuthService.deleteAccount,
				logout: AuthService.logout,
			}
			const { data } = await actionMap[action]()
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
		<>
			{pathname.startsWith('/auth') && (
				<Link
					className={buttonVariants({
						variant: 'outline',
						size: 'icon',
					})}
					href='/'>
					<ChevronLeft />
				</Link>
			)}
			<ThemeToggle />
			{isAuthorized && (
				<>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='outline'
								size='icon'>
								<CircleUser />
							</Button>
						</DialogTrigger>
						<AccountDialogContent
							loading={loading}
							action={() => handleAction('delete')}
						/>
					</Dialog>

					<Button
						size='icon'
						variant='outline'
						disabled={loading || !isAuthorized}
						onClick={() => handleAction('logout')}>
						{loading ? <Loader2 className='animate-spin' /> : <LogOut />}
					</Button>
				</>
			)}
		</>
	)
}

export default Actions
