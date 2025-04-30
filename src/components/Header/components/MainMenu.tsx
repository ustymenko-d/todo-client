import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import AuthService from '@/services/auth.service'
import { toast } from 'sonner'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { navItems } from '@/const'
import VerificationBadge from '@/components/SettingsPage/components/VerificationBadge'

const MainMenu = () => {
	const router = useRouter()
	const pathname = usePathname()
	const isAuthorized = useAppStore((state) => state.isAuthorized)
	const setIsAuthorized = useAppStore((state) => state.setIsAuthorized)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const authHydrated = useAppStore((state) => state.authHydrated)
	const setAuthHydrated = useAppStore((state) => state.setAuthHydrated)
	const [loading, setLoading] = useState<boolean>(false)

	const handleLogout = async () => {
		try {
			setLoading(true)
			const { data } = await AuthService.logout()
			const { success, message } = data
			if (success) {
				toast.success(message)
				setIsAuthorized(false)
				setAccountInfo(null)
				if (!authHydrated) setAuthHydrated(true)
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
					<div className='flex items-center gap-2'>
						<span className='font-medium'>{accountInfo?.username}</span>
						<VerificationBadge />
					</div>
					<span className='text-sm font-light opacity-70'>
						{accountInfo?.email}
					</span>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup className='flex flex-col gap-1'>
					{navItems.map(({ href, label, icon: Icon }) => {
						const isActive = pathname === href

						return (
							<DropdownMenuItem
								key={href}
								asChild>
								<Link
									href={href}
									className={`flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm ${
										isActive
											? 'bg-muted text-primary font-medium'
											: 'hover:bg-accent'
									}`}>
									<Icon
										strokeWidth={1.5}
										className='!w-5 !h-5 opacity-60'
									/>
									{label}
								</Link>
							</DropdownMenuItem>
						)
					})}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={loading || !isAuthorized}
					onClick={handleLogout}
					className='flex items-center gap-2'>
					{loading ? (
						<Loader2
							strokeWidth={1.5}
							className='!w-5 !h-5 animate-spin opacity-60'
						/>
					) : (
						<LogOut
							strokeWidth={1.5}
							className='!w-5 !h-5 opacity-60'
						/>
					)}
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default MainMenu
