// 'use client'

import { useMemo } from 'react'
import { appStore, AuthFormType } from '@/store/store'
import { Button } from '@/components/ui/button'
import RememberMeCheckbox from '@/components/ui/RememberMeCheckbox'
import PasswordInput from '@/components/ui/PasswordInput'
import EmailInput from '@/components/ui/EmailInput'
import FormSuggestion from './FormSuggestion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	authFormSchema,
	emailBaseSchema,
	passwordBaseSchema,
} from '@/schemas/authFormSchema'
import { z, ZodSchema } from 'zod'
import {
	Form,
	FormControl,
	// FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Label } from '../ui/label'

type FieldType = 'email' | 'password' | 'confirmPassword' | 'rememberMe'

interface IDefaultSchemaValues {
	email?: ''
	password?: ''
}

const formConfig: Record<
	AuthFormType,
	{
		fields: FieldType[]
		buttonText: string
		validationSchema: ZodSchema
		defaultValues: IDefaultSchemaValues
	}
> = {
	login: {
		fields: ['email', 'password', 'rememberMe'],
		buttonText: 'Log in',
		validationSchema: authFormSchema,
		defaultValues: {
			email: '',
			password: '',
		},
	},
	signup: {
		fields: ['email', 'password', 'confirmPassword'],
		buttonText: 'Sign up',
		validationSchema: authFormSchema,
		defaultValues: {
			email: '',
			password: '',
		},
	},
	forgotPassword: {
		fields: ['email'],
		buttonText: 'Send password reset email',
		validationSchema: emailBaseSchema,
		defaultValues: {
			email: '',
		},
	},
	resetPassword: {
		fields: ['password', 'confirmPassword'],
		buttonText: 'Confirm',
		validationSchema: passwordBaseSchema,
		defaultValues: {
			password: '',
		},
	},
} as const

const AuthForm = () => {
	const authFormType = appStore((state) => state.authFormType)

	const { fields, buttonText, validationSchema, defaultValues } = useMemo(
		() => formConfig[authFormType],
		[authFormType]
	)

	const authForm = useForm<z.infer<typeof authFormSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues: defaultValues,
	})

	const onSubmit = (values: z.infer<typeof authFormSchema>) => {
		console.log(values)
	}

	return (
		<Form {...authForm}>
			<form onSubmit={authForm.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-6'>
					{fields.includes('email') && (
						<FormField
							control={authForm.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<EmailInput {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{fields.includes('password') && (
						<FormField
							control={authForm.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PasswordInput
											inputId='password'
											label={<FormLabel>Password</FormLabel>}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{fields.includes('confirmPassword') && (
						<PasswordInput
							inputId='confirmPassword'
							label={<Label htmlFor='confirmPassword'>Confirm password</Label>}
						/>
					)}
					{fields.includes('rememberMe') && <RememberMeCheckbox />}

					<Button
						type='submit'
						className='w-full'>
						{buttonText}
					</Button>
				</div>
				{authFormType !== 'resetPassword' && <FormSuggestion />}
			</form>
		</Form>
	)
}

export default AuthForm
