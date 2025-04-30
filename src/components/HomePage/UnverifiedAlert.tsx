'use client'

import useAppStore from '@/store/store'
import { IUserInfo } from '@/types/auth'
import { Separator } from '@/components/ui/separator'
import UnverifiedInfo from '@/components/SettingsPage/components/UnverifiedInfo'

const UnverifiedAlert = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)
	const { isVerified } = accountInfo as IUserInfo

	if (isVerified) return null

	return (
		<div className='pt-4'>
			<h2 className='text-xl font-semibold'>Unverified Alert</h2>
			<Separator className='my-2' />
			<UnverifiedInfo />
		</div>
	)
}

export default UnverifiedAlert
