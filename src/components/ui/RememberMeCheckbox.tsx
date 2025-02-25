'use client'

import { Checkbox } from '@/components/ui/checkbox'

const RememberMeCheckbox = () => {
	return (
		<div className='flex items-center space-x-2'>
			<Checkbox id='remember' />
			<label
				htmlFor='remember'
				className='text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
				Remember me
			</label>
		</div>
	)
}

export default RememberMeCheckbox
