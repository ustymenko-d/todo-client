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
import { TBaseFields } from './AuthForm'

interface AuthFormInputProps {
	name: TBaseFields
	label: string
	control: Control
}

const AuthFormInput = ({ name, label, control }: AuthFormInputProps) => (
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
							forgotBtn={name === 'password'}
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
