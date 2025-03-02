import Header from '@/components/Header'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header>
				<Link
					className={buttonVariants({
						variant: 'outline',
						size: 'icon',
					})}
					href='/'>
					<ChevronLeft />
				</Link>

				<ThemeToggle />
			</Header>

			<main className='container flex items-center justify-center p-2 mx-auto border-dashed sm:border-x grow'>
				{children}
			</main>
		</>
	)
}

export default AuthLayout
