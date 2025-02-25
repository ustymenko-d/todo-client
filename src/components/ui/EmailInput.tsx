import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EmailInput = () => {
	return (
		<div className='grid gap-2'>
			<Label htmlFor='email'>Email</Label>
			<Input
				id='email'
				type='email'
				placeholder='email@example.com'
				required
			/>
		</div>
	)
}

export default EmailInput
