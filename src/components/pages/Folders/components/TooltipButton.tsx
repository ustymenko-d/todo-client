import { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface ITooltipButtonProps extends ComponentProps<typeof Button> {
	label: string
}

const TooltipButton = ({ children, label, ...props }: ITooltipButtonProps) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button {...props}>{children}</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
)

export default TooltipButton
