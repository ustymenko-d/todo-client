'use client'

import { Settings2 } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useBreakpoints from '@/hooks/useBreakpoints'
import useAppStore from '@/store/store'

import { ITableComponentProps } from '../../../Table'

const defaultColumns = ['completed', 'title', 'actions']

const columnLabels: Record<string, string> = {
	description: 'Description',
	folderId: 'Folder',
	startDate: 'Start Date',
	expiresDate: 'Expires Date',
}

const ColumnsViewSettings = ({ table }: ITableComponentProps) => {
	const { widthIndex } = useBreakpoints({ width: [640] })

	const visibleColumns = useAppStore((s) => s.visibleColumns)
	const toggleColumnVisibility = useAppStore((s) => s.toggleColumnVisibility)
	const setVisibleColumns = useAppStore((s) => s.setVisibleColumns)

	const allColumns = table.getAllColumns()

	useEffect(() => {
		if (Object.keys(visibleColumns).length === 0) {
			const initial: Record<string, boolean> = {}
			allColumns.forEach((col) => {
				if (col.getCanHide() && !defaultColumns.includes(col.id)) {
					initial[col.id] = col.getIsVisible()
				}
			})
			setVisibleColumns(initial)
		}
	}, [allColumns, visibleColumns, setVisibleColumns])

	useEffect(() => {
		Object.entries(visibleColumns).forEach(([id, isVisible]) => {
			const col = allColumns.find((col) => col.id === id)
			if (col && col.getIsVisible() !== isVisible) {
				col.toggleVisibility(isVisible)
			}
		})
	}, [visibleColumns, allColumns])

	const renderColumnCheckboxes = () =>
		allColumns
			.filter((col) => col.getCanHide() && !defaultColumns.includes(col.id))
			.map((col) => (
				<DropdownMenuCheckboxItem
					key={col.id}
					className='capitalize'
					checked={visibleColumns[col.id] ?? true}
					onCheckedChange={() => toggleColumnVisibility(col.id)}>
					{columnLabels[col.id] ?? col.id}
				</DropdownMenuCheckboxItem>
			))

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					className='ml-auto min-w-9'
					size={!!widthIndex ? 'default' : 'icon'}>
					<Settings2 />
					{!!widthIndex && <span className='hidden sm:block'>View</span>}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{renderColumnCheckboxes()}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ColumnsViewSettings
