import { FC, InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
}

const EmailInput: FC<EmailInputProps> = ({ label, ...props }) => {
	return (
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
}

export default EmailInput
