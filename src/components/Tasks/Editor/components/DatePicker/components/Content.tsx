import { addDays } from 'date-fns'
import { useState } from 'react'

import { Calendar } from '@/components/ui/calendar'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import useIsTouchDevice from '@/hooks/useIsTouchDevice'

import { DatePickerProps } from '../DatePicker'
import DatePresetSelector from './DatePresetSelector'
import TimeSelector from './TimeSelector'

const Content = ({ field }: DatePickerProps) => {
	const isTouchDevice = useIsTouchDevice()

	const [internalDate, setInternalDate] = useState<Date | null>(
		field.value || null
	)

	const now = new Date()
	const isToday = internalDate?.toDateString() === now.toDateString()

	const hours = Array.from({ length: 24 }, (_, i) => i)
	const minutes = Array.from({ length: 60 }, (_, i) => i)

	const selectedHour = internalDate?.getHours() ?? 0
	const selectedMinute = internalDate?.getMinutes() ?? 0

	const setAndEmit = (date: Date | null) => {
		setInternalDate(date)
		field.onChange(date)
	}

	const handleDateChange = (date?: Date) => {
		if (!date) return

		const newDate = new Date(date)
		newDate.setSeconds(0, 0)

		setAndEmit(newDate)
	}

	const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
		if (!internalDate) return

		const newDate = new Date(internalDate)

		if (type === 'hour') newDate.setHours(value)
		else newDate.setMinutes(value)

		setAndEmit(newDate)
	}

	const handleSelectChange = (value: string) => {
		if (value === 'null') {
			setAndEmit(null)
		} else {
			const offset = parseInt(value)
			const newDate = addDays(new Date().setHours(0, 0, 0, 0), offset)
			setAndEmit(new Date(newDate))
		}
	}

	const showTimeWarning = (() => {
		if (!internalDate || !isToday) return false

		const combined = new Date(internalDate)
		combined.setHours(selectedHour, selectedMinute, 0, 0)

		return combined < now
	})()

	return (
		<>
			{isTouchDevice ? (
				<DatePresetSelector onSelect={handleSelectChange} />
			) : (
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
			)}

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
					selectedValue={internalDate?.getHours()}
					showWarning={showTimeWarning}
				/>
				<TimeSelector
					label='Minute'
					values={minutes}
					onValueChange={(value) => handleTimeChange('minute', parseInt(value))}
					selectedValue={internalDate?.getMinutes()}
					showWarning={showTimeWarning}
				/>
			</div>

			{showTimeWarning && (
				<p className='mt-1 sm:pl-2 text-xs text-destructive'>
					Start time must be in the future
				</p>
			)}
		</>
	)
}

export default Content
