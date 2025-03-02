'use client'

import Header from '@/components/Header'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import AuthService from '@/services/api/auth'
import TokenService from '@/utils/token'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

const DashboardPage = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleDeleteAccount = async () => {
		try {
			setLoading(true)
			const response = await AuthService.deleteAccount()

			if (response.success) {
				TokenService.removeStorageToken()
				toast.info('Your account has been deleted')
				router.push('/')
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error('Log out error:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleLogout = async () => {
		try {
			setLoading(true)
			const response = await AuthService.logout()

			if (response.success) {
				TokenService.removeStorageToken()
				router.push('/')
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error('Log out error:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Header>
				<ThemeToggle />
				<Button
					disabled={loading}
					onClick={handleLogout}>
					{loading ? (
						<>
							<Loader2 className='animate-spin' />
							<span>Please wait</span>
						</>
					) : (
						'Log out'
					)}
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild={true}>
						<Button
							variant='destructive'
							disabled={loading}>
							{loading ? (
								<>
									<Loader2 className='animate-spin' />
									<span>Please wait</span>
								</>
							) : (
								'Delete account'
							)}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure you want to delete your account?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDeleteAccount}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</Header>

			<main className='container px-2 py-3 mx-auto border-dashed grow border-x'></main>
		</>
	)
}

export default DashboardPage
