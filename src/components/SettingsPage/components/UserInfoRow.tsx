import { Label } from '@/components/ui/label'
import React from 'react'

const UserInfoRow = ({
	label,
	htmlFor,
	children,
}: {
	label: string
	htmlFor: 'email' | 'username'
	children: React.ReactNode
}) => (
	<div className='flex flex-col'>
		<Label
			htmlFor={htmlFor}
			className='text-muted-foreground'>
			{label}
		</Label>
		{children}
	</div>
)

export default UserInfoRow
