import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import TimeSelector from './TimeSelector'
import { useState } from 'react'
import { DatePickerProps } from '../DatePicker'
import { addDays } from 'date-fns'

const Content = ({ field }: DatePickerProps) => {
	const [internalDate, setInternalDate] = useState<Date | null>(
		field.value || null
	)

	const now = new Date()
	const isToday = internalDate?.toDateString() === now.toDateString()
	const hours = Array.from({ length: 24 }, (_, i) => i)
	const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

	const handleDateChange = (date: Date | undefined) => {
		if (!date) return

		const newDate = new Date(date)
		newDate.setSeconds(0, 0)

		if (isToday) {
			const nextAvailableTime = getNextAvailableTime(newDate)
			setInternalDate(nextAvailableTime)
			field.onChange(nextAvailableTime)
		} else {
			newDate.setHours(0, 0)
			setInternalDate(newDate)
			field.onChange(newDate)
		}
	}

	const getNextAvailableTime = (date: Date) => {
		const nextMinutes = Math.ceil(now.getMinutes() / 5) * 5
		date.setHours(now.getHours(), nextMinutes, 0, 0)

		if (date.getDate() !== now.getDate()) {
			date.setDate(date.getDate() + 1)
			date.setHours(0, 0, 0, 0)
		}

		return date
	}

	const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
		if (!internalDate) return
		const newDate = new Date(internalDate)

		if (type === 'hour') newDate.setHours(value)
		else newDate.setMinutes(value)

		if (newDate.toDateString() === now.toDateString() && newDate < now) return

		setInternalDate(newDate)
		field.onChange(newDate)
	}

	const handleSelectChange = (value: string) => {
		if (value === 'null') {
			setInternalDate(null)
			field.onChange(null)
		} else {
			const offset = parseInt(value)
			const newDate = addDays(new Date().setHours(0, 0, 0, 0), offset)
			setInternalDate(newDate)
			field.onChange(newDate)
		}
	}

	return (
		<>
			<Select onValueChange={handleSelectChange}>
				<SelectTrigger>
					<SelectValue placeholder='Select' />
				</SelectTrigger>
				<SelectContent position='popper'>
					<SelectItem value='null'>No Date</SelectItem>
					<SelectItem value='0'>Today</SelectItem>
					<SelectItem value='1'>Tomorrow</SelectItem>
					<SelectItem value='7'>In a week</SelectItem>
				</SelectContent>
			</Select>

			<div className='border rounded-md'>
				<Calendar
					mode='single'
					selected={internalDate ?? undefined}
					onSelect={handleDateChange}
					disabled={{ before: new Date() }}
				/>
			</div>

			<div className='grid grid-cols-2 gap-2 sm:pl-2'>
				<TimeSelector
					label='Hour'
					values={hours}
					onValueChange={(value) => handleTimeChange('hour', parseInt(value))}
					internalDate={internalDate}
					selectedValue={internalDate?.getHours()}
				/>
				<TimeSelector
					label='Minute'
					values={minutes}
					onValueChange={(value) => handleTimeChange('minute', parseInt(value))}
					internalDate={internalDate}
					selectedValue={internalDate?.getMinutes()}
				/>
			</div>
		</>
	)
}

export default Content
