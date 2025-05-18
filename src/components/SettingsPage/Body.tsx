'use client'

import useAppStore from '@/store/store'
import UnverifiedInfo from './components/UnverifiedInfo'
import VerificationBadge from '../ui/VerificationBadge'
import DeleteSection from './components/DeleteSection'

const Body = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)

	const renderInfoRow = (label: string, children: React.ReactNode) => (
		<div className='flex flex-col'>
			<span className='text-muted-foreground'>{label}</span>
			{children}
		</div>
	)

	return (
		<div className='flex flex-col gap-2 pt-4'>
			{renderInfoRow('Username:', <span>{accountInfo?.username}</span>)}
			{renderInfoRow(
				'Email:',
				<div className='flex items-center gap-2'>
					<span id='email'>{accountInfo?.email}</span>
					<VerificationBadge />
				</div>
			)}

			{!accountInfo?.isVerified && <UnverifiedInfo />}

			<DeleteSection />
		</div>
	)
}

export default Body
