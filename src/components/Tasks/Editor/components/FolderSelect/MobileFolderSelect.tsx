'use client'

import { useSelect } from 'downshift'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useMemo } from 'react'

import useFetch from '@/hooks/folders/useFetch'
import { cn } from '@/lib/utils'

import { IFolderSelectProps } from '../EditorForm'

const MobileFolderSelect = ({ field }: IFolderSelectProps) => {
	const { data } = useFetch({ page: 1, limit: 25 })

	const items = useMemo(() => {
		const folders = data?.folders ?? []
		return [{ id: 'null', name: 'No Folder' }, ...folders]
	}, [data?.folders])

	const selectedItem = items.find(f => f.id === (field.value ?? 'null'))

	const {
		isOpen,
		getToggleButtonProps,
		getMenuProps,
		getItemProps,
		highlightedIndex,
		selectedItem: downshiftSelected,
	} = useSelect({
		items,
		selectedItem,
		itemToString: item => item?.name ?? '',
		onSelectedItemChange: ({ selectedItem }) => {
			field.onChange(selectedItem?.id === 'null' ? null : selectedItem?.id)
		},
	})

	return (
		<div className='relative'>
			<button
				type='button'
				{...getToggleButtonProps({
					'aria-haspopup': 'listbox',
					'aria-expanded': isOpen,
					id: 'folder-select-trigger',
				})}
				className='flex items-center justify-between w-full px-3 py-2 text-sm bg-transparent border rounded-md shadow-sm h-9 border-input ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
				<span className='truncate'>{selectedItem?.name || 'Select folder...'}</span>
				<ChevronsUpDown className='w-4 h-4 ml-2 opacity-50' />
			</button>

			<ul
				tabIndex={isOpen ? 0 : -1}
				{...getMenuProps({
					id: 'folder-select-listbox',
					'aria-labelledby': 'folder-select-trigger',
				})}
				className={cn(
					'absolute z-50 max-h-60 w-full my-1 px-1 overflow-hidden rounded-md bg-popover text-sm  duration-300',
					isOpen ? 'max-h-60 py-1 border shadow-md' : 'max-h-0 pointer-events-none'
				)}>
				{items.map((item, index) => {
					const isSelected = downshiftSelected?.id === item.id
					const isHighlighted = highlightedIndex === index

					return (
						<li
							key={item.id}
							{...getItemProps({ item, index })}
							className={cn(
								'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5',
								isHighlighted && 'bg-accent text-accent-foreground'
							)}>
							<span className={cn('truncate', isSelected && 'font-medium')}>{item.name}</span>
							{isSelected && <Check className='w-4 h-4 ml-auto opacity-100' />}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default MobileFolderSelect
