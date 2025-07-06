import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { ControllerRenderProps } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import useBreakpoints from '@/hooks/useBreakpoints'
import { cn } from '@/lib/utils'
import { TTaskBase } from '@/types/tasks'

import Content from './components/Content'

export interface DatePickerProps {
	field: ControllerRenderProps<TTaskBase, 'expiresDate' | 'startDate'>
}

const DatePicker = ({ field }: DatePickerProps) => {
	const { heightIndex } = useBreakpoints({ height: [800] })

	const formattedValue =
		field.value instanceof Date && !isNaN(field.value.getTime())
			? format(field.value, 'MM/dd/yyyy HH:mm')
			: 'Pick a date'

	const Trigger = (
		<Button
			variant='outline'
			className={cn(
				'justify-start text-left font-normal w-full text-sm',
				!field.value && 'text-muted-foreground'
			)}>
			<CalendarIcon className='w-4 h-4 mr-2' />
			{formattedValue}
		</Button>
	)

	if (heightIndex) {
		return (
			<Popover modal>
				<PopoverTrigger asChild>{Trigger}</PopoverTrigger>
				<PopoverContent
					align='start'
					className='flex flex-col w-auto gap-2 px-2 py-3'>
					<Content field={field} />
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{Trigger}</DialogTrigger>
			<DialogContent className='max-w-fit'>
				<DialogHeader>
					<DialogTitle className='text-center'>Select date:</DialogTitle>
				</DialogHeader>
				<Content field={field} />
				<DialogClose asChild>
					<Button>Confirm</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	)
}

export default DatePicker
