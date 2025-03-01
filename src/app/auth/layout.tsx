import ThemeToggle from '@/components/Theme/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div className='border-b border-dashed'>
				<div className='container border-x border-dashed mx-auto py-3 px-2 flex items-center gap-x-2'>
					<Link
						className={buttonVariants({
							variant: 'outline',
							size: 'icon',
						})}
						href='/'>
						<ChevronLeft />
					</Link>

					<ThemeToggle />
				</div>
			</div>

			<main className='border-x border-dashed container mx-auto px-2 grow flex items-center justify-center'>
				{children}
			</main>
		</>
	)
}

export default AuthLayout
