import { FC } from 'react'
import { Control } from 'react-hook-form'
import EmailInput from '../ui/EmailInput'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import PasswordInput from '../ui/PasswordInput'
import { BaseFieldType } from './AuthForm'

interface AuthFormInputProps {
	name: BaseFieldType
	label: string
	control: Control
}

const AuthFormInput: FC<AuthFormInputProps> = ({ name, label, control }) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				{name === 'email' && <FormLabel>{label}</FormLabel>}
				<FormControl>
					{name === 'email' ? (
						<EmailInput
							{...field}
							value={field.value || ''}
						/>
					) : (
						<PasswordInput
							{...field}
							labelNode={<FormLabel>{label}</FormLabel>}
							value={field.value || ''}
						/>
					)}
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
)

export default AuthFormInput
