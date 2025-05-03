import { InputHTMLAttributes, ReactNode, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '../../ui/button'
import useAppStore from '@/store/store'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
	labelNode: ReactNode
	forgotBtn?: boolean
}

const PasswordInput = ({
	labelNode,
	forgotBtn = false,
	...props
}: PasswordInputProps) => {
	const [showPassword, setShowPassword] = useState(false)
	const authFormType = useAppStore((state) => state.authFormType)
	const setAuthFormType = useAppStore((state) => state.setAuthFormType)

	return (
		<div className='grid gap-2'>
			<div className='flex items-center'>
				{labelNode}
				{authFormType === 'signin' && forgotBtn && (
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
