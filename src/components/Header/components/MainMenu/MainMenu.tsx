import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAppStore from '@/store/store'
import { CircleUser, Loader2, LogOut, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AccountDialogContent from './Account/AccountDialogContent'
import { toast } from 'sonner'
import AuthService from '@/services/Axios/auth.service'

const MainMenu = () => {
	const router = useRouter()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const [loading, setLoading] = useState<boolean>(false)

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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className='flex gap-1'
					variant='outline'>
					<Menu />
					<span className='unvisible sm:visible'>Menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='start'
				className='w-40'>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Dialog>
						<DialogTrigger asChild>
							<DropdownMenuItem
								onSelect={(e) => e.preventDefault()}
								className='flex items-center gap-1 justify-between'>
								Profile
								<CircleUser className='opacity-60' />
							</DropdownMenuItem>
						</DialogTrigger>
						<AccountDialogContent
							loading={loading}
							action={() => handleAction('delete')}
						/>
					</Dialog>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={loading || !isAuthorized}
					onClick={() => handleAction('logout')}
					className='flex items-center gap-1 justify-between'>
					Log out
					{loading ? (
						<Loader2 className='animate-spin opacity-60' />
					) : (
						<LogOut className='opacity-60' />
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default MainMenu
