import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { ReactNode } from 'react'

export const formatValue = (value: string | null | undefined): ReactNode => {
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

export const formatDate = (dateString?: Date | null): string => {
	if (!dateString) return '-'
	const date = new Date(dateString)
	return date.toLocaleString(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})
}

export const stringToBoolean = (value: string): boolean =>
	value?.trim().toLowerCase() === 'true' || false
