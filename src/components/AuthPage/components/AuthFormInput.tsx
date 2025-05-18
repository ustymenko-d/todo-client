import { Control } from 'react-hook-form'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import EmailInput from '@/components/AuthPage/components/EmailInput'
import PasswordInput from '@/components/AuthPage/components/PasswordInput'
import { TBaseFields } from '@/types/auth'

const AuthFormInput = ({
	control,
	name,
}: {
	control: Control
	name: TBaseFields
}) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				{name === 'email' && <FormLabel>Email</FormLabel>}
				<FormControl>
					{name === 'email' ? (
						<EmailInput
							{...field}
							value={field.value ?? ''}
						/>
					) : (
						<PasswordInput
							{...field}
							forgotBtn={name === 'password'}
							labelNode={
								name === 'password' ? (
									<FormLabel>Password</FormLabel>
								) : (
									<FormLabel>Confirm Password</FormLabel>
								)
							}
							value={field.value ?? ''}
						/>
					)}
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
)

export default AuthFormInput
