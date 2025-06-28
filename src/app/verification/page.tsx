import Link from 'next/link'

import VerificationStatus from '@/components/pages/Verification/VerificationStatus'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const VerificationPage = () => (
	<Card className='sm:w-96'>
		<CardHeader className='text-center'>
			<CardTitle className='text-2xl font-bold'>
				Email verification status:
			</CardTitle>

			<VerificationStatus />
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

export default VerificationPage
