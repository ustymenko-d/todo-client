'use client'

import { ISubtask } from '@/types/task.types'
import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import columns from '../Columns/Columns'
import { FC, Fragment, useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

interface ISubtasksTableProps {
	data: ISubtask[]
	classNames?: string
}

const SubtasksTable: FC<ISubtasksTableProps> = ({ data, classNames }) => {
	console.log(data)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getExpandedRowModel: getExpandedRowModel(),
		getRowCanExpand: (row) => row.original?.subtasks.length > 0,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	})

	return (
		<div className={classNames}>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => {
							const { id, subtasks } = row.original as ISubtask

							return (
								<Fragment key={id}>
									<TableRow>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
									{row.getIsExpanded() && (
										<TableRow>
											<TableCell
												colSpan={row.getAllCells().length}
												className='bg-muted pl-1 pr-0 pt-1 pb-0'>
												<SubtasksTable
													data={subtasks}
													classNames='border-l bg-white'
												/>
											</TableCell>
										</TableRow>
									)}
								</Fragment>
							)
						})
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className='h-24 text-center'>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}

export default SubtasksTable
