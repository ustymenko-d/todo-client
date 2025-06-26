import Link from 'next/link'

import AuthAPI from '@/api/auth.api'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import VerificationStatus from '@/components/VerificationPage/VerificationStatus'
import { cn } from '@/lib/utils'

interface VerificationPageProps {
	searchParams: Promise<{
		verificationToken: string
	}>
}

const VerificationPage = async ({ searchParams }: VerificationPageProps) => {
	const { verificationToken } = await searchParams
	const { message } = await AuthAPI.verifyEmail(verificationToken)

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
