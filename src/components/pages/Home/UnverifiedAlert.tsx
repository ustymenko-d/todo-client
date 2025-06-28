'use client'

import { Separator } from '@/components/ui/separator'
import UnverifiedInfo from '@/components/UnverifiedInfo'
import useAccountInfo from '@/hooks/useAccountInfo'

const UnverifiedAlert = () => {
	const { data } = useAccountInfo()

	if (!data || data?.isVerified) return null

	return (
		<div className='pt-4'>
			<h2 className='text-xl font-semibold'>Unverified Alert</h2>
			<Separator className='my-2' />
			<UnverifiedInfo />
		</div>
	)
}

export default UnverifiedAlert
