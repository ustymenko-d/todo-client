import { buttonVariants } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='container mx-auto py-4 px-2 flex flex-col grow w-full '>
			<Link
				className={buttonVariants({
					variant: 'outline',
					size: 'icon',
				})}
				href='/'>
				<ChevronLeft />
			</Link>

			<div className='grow flex items-center justify-center'>{children}</div>
		</div>
	)
}

export default AuthLayout
