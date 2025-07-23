import { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props extends ComponentProps<typeof Input> {
	label?: string
}

const EmailInput = ({ label, ...props }: Props) => (
	<div className='grid gap-2'>
		{label && <Label htmlFor='email'>{label}</Label>}
		<Input
			id='email'
			type='email'
			placeholder='email@example.com'
			required
			{...props}
		/>
	</div>
)

export default EmailInput
