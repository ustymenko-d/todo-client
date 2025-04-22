import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { ReactNode } from 'react'

const formatValue = (value: string | null): ReactNode => {
	if (!value) return '-'
	const stringValue = String(value)
	if (stringValue.length <= 30) return <p>{stringValue}</p>
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<p>{stringValue.slice(0, 30) + '…'}</p>
				</TooltipTrigger>
				<TooltipContent>
					<p>{stringValue}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default formatValue