'use client'

import { useSelect } from 'downshift'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type DateOption = {
	label: string
	value: string
}

interface Props {
	onSelect: (value: string) => void
}

const options: DateOption[] = [
	{ label: 'No Date', value: 'null' },
	{ label: 'Today', value: '0' },
	{ label: 'Tomorrow', value: '1' },
	{ label: 'In a week', value: '7' },
]

const DatePresetSelector = ({ onSelect }: Props) => {
	const [selectedItem, setSelectedItem] = useState<DateOption | null>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const {
		isOpen,
		getToggleButtonProps,
		getMenuProps,
		getItemProps,
		highlightedIndex,
		selectedItem: downshiftSelected,
	} = useSelect({
		items: options,
		selectedItem,
		itemToString: item => item?.label || '',
		onSelectedItemChange: ({ selectedItem }) => {
			setSelectedItem(selectedItem ?? null)
			if (selectedItem) onSelect(selectedItem.value)
		},
	})

	return (
		<div className='relative'>
			<button
				type='button'
				ref={triggerRef}
				{...getToggleButtonProps({
					'aria-haspopup': 'listbox',
					'aria-expanded': isOpen,
					id: 'date-select-trigger',
				})}
				className={cn(
					'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring'
				)}>
				<span className='truncate'>{selectedItem?.label || 'Select'}</span>
				<ChevronsUpDown className='w-4 h-4 ml-2 opacity-50' />
			</button>

			<ul
				tabIndex={isOpen ? 0 : -1}
				{...getMenuProps({
					id: 'date-select-listbox',
					'aria-labelledby': 'date-select-trigger',
				})}
				className={cn(
					'absolute z-50 max-h-60 w-full my-1 px-1 overflow-hidden rounded-md bg-popover text-sm  duration-300',
					isOpen ? 'max-h-60 py-1 border shadow-md' : 'max-h-0 pointer-events-none'
				)}>
				{options.map((item, index) => (
					<li
						key={item.value}
						{...getItemProps({ item, index })}
						className={cn(
							'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5',
							highlightedIndex === index && 'bg-accent text-accent-foreground'
						)}>
						<span
							className={cn('truncate', downshiftSelected?.value === item.value && 'font-medium')}>
							{item.label}
						</span>
						{downshiftSelected?.value === item.value && (
							<Check className='w-4 h-4 ml-auto opacity-100' />
						)}
					</li>
				))}
			</ul>
		</div>
	)
}

export default DatePresetSelector
