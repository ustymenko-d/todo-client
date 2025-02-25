'use client'

import { FC, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from './button'
import { appStore } from '@/store/store'

interface PasswordInputProps {
	label: string
}

const PasswordInput: FC<PasswordInputProps> = ({ label }) => {
	const [showPassword, setShowPassword] = useState(false)
	const authFormType = appStore((state) => state.authFormType)
	const setAuthFormType = appStore((state) => state.setAuthFormType)

	return (
		<div className='grid gap-2'>
			<div className='flex items-center'>
				<Label htmlFor='password'>{label}</Label>
				{authFormType === 'login' && (
					<Button
						onClick={() => setAuthFormType('forgotPassword')}
						variant='link'
						size='none'
						className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
						Forgot your password?
					</Button>
				)}
			</div>
			<div className='relative'>
				<Input
					id={label.toLowerCase().split(' ').join('')}
					type={showPassword ? 'text' : 'password'}
					required
					className='pr-10'
				/>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-0 top-1/2 -translate-y-1/2 h-full aspect-square flex items-center justify-center text-gray-500 hover:text-gray-700'>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{showPassword ? 'Hide' : 'Show'} password</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	)
}

export default PasswordInput
