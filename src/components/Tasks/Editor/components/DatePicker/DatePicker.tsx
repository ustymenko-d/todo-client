import { format } from 'date-fns'
import useBreakpoints from '@/hooks/useBreakpoints'
import { cn } from '@/lib/utils'
import {
	Dialog,
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
import { Button } from '@/components/ui/button'
import { ControllerRenderProps } from 'react-hook-form'
import Content from './components/Content'
import { CalendarIcon } from 'lucide-react'
import { TTaskBase } from '@/types/tasks'

export interface DatePickerProps {
	field: ControllerRenderProps<TTaskBase, 'expiresDate' | 'startDate'>
}

const DatePicker = ({ field }: DatePickerProps) => {
	const { heightIndex } = useBreakpoints({ height: [800] })

	return heightIndex ? (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'justify-start text-left font-normal w-full',
						!field.value && 'text-muted-foreground'
					)}>
					<CalendarIcon className='w-4 h-4 mr-2' />
					{field.value
						? format(field.value, 'MM/dd/yyyy HH:mm')
						: 'Pick a date'}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='start'
				className='flex flex-col w-auto gap-2 px-2 py-3'>
				<Content field={field} />
			</PopoverContent>
		</Popover>
	) : (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'justify-start text-left font-normal w-full',
						!field.value && 'text-muted-foreground'
					)}>
					<CalendarIcon className='w-4 h-4 mr-2' />
					{field.value
						? format(field.value, 'MM/dd/yyyy HH:mm')
						: 'Pick a date'}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-fit'>
				<DialogHeader>
					<DialogTitle className='text-center'>Select date:</DialogTitle>
				</DialogHeader>
				<Content field={field} />
			</DialogContent>
		</Dialog>
	)
}

export default DatePicker
