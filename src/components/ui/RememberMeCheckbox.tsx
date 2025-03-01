'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { appStore } from '@/store/store'

const RememberMeCheckbox = () => {
	const isRememberUser = appStore((state) => state.isRememberUser)
	const toggleIsRememberUser = appStore((state) => state.toggleIsRememberUser)

	return (
		<div className='flex items-center space-x-2'>
			<Checkbox
				id='rememberMe'
				checked={isRememberUser}
				onCheckedChange={toggleIsRememberUser}
			/>
			<label
				htmlFor='rememberMe'
				className='text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
				Remember me
			</label>
		</div>
	)
}

export default RememberMeCheckbox
