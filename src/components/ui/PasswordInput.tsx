'use client'

import { FC, InputHTMLAttributes, ReactNode, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from './button'
import { appStore } from '@/store/store'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
	labelNode: ReactNode
	forgotBtn?: boolean
}

const PasswordInput: FC<PasswordInputProps> = ({
	labelNode,
	forgotBtn = false,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false)
	const authFormType = appStore((state) => state.authFormType)
	const setAuthFormType = appStore((state) => state.setAuthFormType)

	return (
		<div className='grid gap-2'>
			<div className='flex items-center'>
				{labelNode}
				{authFormType === 'login' && forgotBtn && (
					<Button
						type='button'
						onClick={() => setAuthFormType('forgotPassword')}
						variant='link'
						size='none'
						className='inline-block ml-auto text-sm underline-offset-4 hover:underline'>
						Forgot your password?
					</Button>
				)}
			</div>
			<div className='relative'>
				<Input
					type={showPassword ? 'text' : 'password'}
					required
					className='pr-10'
					{...props}
				/>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-0 flex items-center justify-center h-full text-gray-500 -translate-y-1/2 top-1/2 aspect-square hover:text-gray-700'>
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
