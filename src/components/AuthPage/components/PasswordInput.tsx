import { Eye, EyeOff } from 'lucide-react'
import { InputHTMLAttributes, ReactNode, useState } from 'react'

import { Input } from '@/components/ui/input'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import useAppStore from '@/store/store'

import { Button } from '../../ui/button'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
	labelNode: ReactNode
	forgotBtn?: boolean
}

const PasswordInput = ({
	labelNode,
	forgotBtn = false,
	...props
}: PasswordInputProps) => {
	const authFormType = useAppStore((s) => s.authFormType)
	const setAuthFormType = useAppStore((s) => s.setAuthFormType)

	const [showPassword, setShowPassword] = useState(false)

	const handleForgotPassword = () => {
		setAuthFormType('forgotPassword')
	}

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev)
	}

	return (
		<div className='grid gap-2'>
			<div className='flex items-center'>
				{labelNode}
				{authFormType === 'signin' && forgotBtn && (
					<Button
						type='button'
						onClick={handleForgotPassword}
						variant='link'
						size='none'
						className='inline-block ml-auto text-sm rounded-none hover:no-underline animated-underline'>
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
								onClick={toggleShowPassword}
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
