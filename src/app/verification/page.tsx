import AuthService from '@/services/auth.service'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import VerificationStatus from '@/components/VerificationPage/VerificationStatus'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface VerificationPageProps {
	searchParams: Promise<{
		verificationToken: string
	}>
}

const VerificationPage = async ({ searchParams }: VerificationPageProps) => {
	const { verificationToken } = await searchParams
	const { data } = await AuthService.verifyEmail(verificationToken)
	const { message } = data

	return (
		<Card className='sm:w-96'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-bold'>
					Email verification status:
				</CardTitle>

				<VerificationStatus message={message} />
			</CardHeader>

			<CardFooter>
				<Link
					href='/'
					className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
					Return Home
				</Link>
			</CardFooter>
		</Card>
	)
}

export default VerificationPage
