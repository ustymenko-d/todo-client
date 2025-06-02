import { RefreshCcw } from 'lucide-react'
import React from 'react'

import { IRefreshButtonProps } from '@/types/common'

import { Button } from './button'

const RefreshButton = ({ handleRefresh }: IRefreshButtonProps) => (
	<Button
		variant='outline'
		onClick={handleRefresh}>
		<RefreshCcw
			size={16}
			strokeWidth={1.25}
			className='opacity-60'
		/>
		Refresh
	</Button>
)

export default RefreshButton
