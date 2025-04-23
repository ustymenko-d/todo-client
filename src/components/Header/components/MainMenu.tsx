import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAppStore from '@/store/store'
import { Loader2, LogOut, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import AuthService from '@/services/Axios/auth.service'
import AccountGroup from './AccountGroup'
import FoldersGroup from './FoldersGroup'

const MainMenu = () => {
	const router = useRouter()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const [loading, setLoading] = useState<boolean>(false)

	const handleLogout = async () => {
		try {
			setLoading(true)
			const { data } = await AuthService.logout()
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
				className=''>
				<DropdownMenuGroup className='flex flex-col px-3 py-2'>
					<span className='font-medium'>{accountInfo?.username}</span>
					<span className='font-light opacity-70 text-sm'>
						{accountInfo?.email}
					</span>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<AccountGroup />
				<FoldersGroup />
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={loading || !isAuthorized}
					onClick={handleLogout}
					className='flex items-center gap-2'>
					{loading ? (
						<Loader2 className='animate-spin opacity-60' />
					) : (
						<LogOut className='opacity-60' />
					)}
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default MainMenu
