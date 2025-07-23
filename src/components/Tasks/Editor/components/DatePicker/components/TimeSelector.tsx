'use client'

import { ChangeEvent } from 'react'

import { Input } from '@/components/ui/input'
import useBreakpoints from '@/hooks/useBreakpoints'
import { cn } from '@/lib/utils'

interface Props {
	label: 'Hour' | 'Minute'
	values: number[]
	onValueChange: (value: string) => void
	selectedValue: number | undefined
	internalDate: Date | null
	showWarning?: boolean
}

const TimeSelector = ({
	label,
	values,
	onValueChange,
	selectedValue,
	internalDate,
	showWarning,
}: Props) => {
	const { heightIndex } = useBreakpoints({ height: [800] })

	const min = values[0]
	const max = values[values.length - 1]

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		if (val === '' || !isNaN(Number(val))) {
			onValueChange(val)
		}
	}

	return (
		<div>
			<label className='block mb-1 text-sm text-muted-foreground'>{label}</label>
			<Input
				type='number'
				min={min}
				max={max}
				step={1}
				disabled={!internalDate}
				inputMode='numeric'
				value={selectedValue ?? ''}
				onChange={handleChange}
				className={cn(
					!heightIndex && 'max-h-[70vh]',
					showWarning && 'border-destructive text-destructive placeholder-destructive'
				)}
			/>
		</div>
	)
}

export default TimeSelector
