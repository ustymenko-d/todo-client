import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

const TooltipButton = ({
	children,
	label,
	...buttonProps
}: {
	children: React.ReactNode
	label: string
} & React.ComponentProps<typeof Button>) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button {...buttonProps}>{children}</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
)

export default TooltipButton
