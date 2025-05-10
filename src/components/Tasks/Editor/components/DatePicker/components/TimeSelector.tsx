import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface TimeSelectorProps {
	label: string
	values: number[]
	onValueChange: (value: string) => void
	selectedValue: number | undefined
	internalDate: Date | null
}

const TimeSelector = ({
	label,
	values,
	onValueChange,
	selectedValue,
	internalDate,
}: TimeSelectorProps) => {
	const now = new Date()
	const isToday = internalDate?.toDateString() === now.toDateString()

	const isOptionDisabled = (value: number): boolean => {
		if (!internalDate || !isToday) return false

		const tempDate = new Date(internalDate)
		const selectedHour = label === 'Hour' ? value : internalDate.getHours() ?? 0
		const selectedMinute =
			label === 'Minute' ? value : internalDate.getMinutes() ?? 0

		tempDate.setHours(selectedHour, selectedMinute, 0, 0)
		return tempDate < now
	}

	return (
		<div>
			<h4 className='mb-1 text-sm text-muted-foreground'>{label}</h4>
			<Select
				onValueChange={onValueChange}
				value={selectedValue?.toString()}>
				<SelectTrigger>
					<SelectValue placeholder='--' />
				</SelectTrigger>
				<SelectContent>
					{values.map((value) => (
						<SelectItem
							key={value}
							value={value.toString()}
							disabled={isOptionDisabled(value)}>
							{value.toString().padStart(2, '0')}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export default TimeSelector
