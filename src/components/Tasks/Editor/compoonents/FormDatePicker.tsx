'use client'

import { addDays, format } from 'date-fns'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ControllerRenderProps } from 'react-hook-form'
import { TaskFormSchema } from '@/schemas/tasks.schema'
import { CalendarIcon } from 'lucide-react'

interface FormDatePickerProps {
	field: ControllerRenderProps<TaskFormSchema, 'expiresAt'>
}

const FormDatePicker = ({ field }: FormDatePickerProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'justify-start text-left font-normal',
						!field.value && 'text-muted-foreground'
					)}>
					<CalendarIcon />
					{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='start'
				className='flex w-auto flex-col space-y-2 p-2'>
				<Select
					onValueChange={(value) =>
						field.onChange(addDays(new Date(), parseInt(value)))
					}>
					<SelectTrigger>
						<SelectValue placeholder='Select' />
					</SelectTrigger>
					<SelectContent position='popper'>
						<SelectItem value='0'>Today</SelectItem>
						<SelectItem value='1'>Tomorrow</SelectItem>
						<SelectItem value='7'>In a week</SelectItem>
					</SelectContent>
				</Select>
				<div className='rounded-md border'>
					<Calendar
						mode='single'
						selected={field.value ?? undefined}
						onSelect={field.onChange}
						disabled={{ before: new Date() }}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default FormDatePicker
