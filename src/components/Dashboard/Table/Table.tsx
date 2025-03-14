'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	Table as TanstackTable,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import columns from './components/Columns/Columns'
import Header from './components/Header'
import Body from './components/Body'
import Pagination from './components/Pagination/Pagination'

interface TableProps<TData> {
	data: TData[]
	pagination: {
		page: number
		limit: number
		pages: number
	}
}

export interface TableComponentsProps<TData> {
	table: TanstackTable<TData>
}

const Table = <TData,>({ data, pagination }: TableProps<TData>) => {
	const router = useRouter()
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const { page, limit, pages } = pagination

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			pagination: {
				pageIndex: page - 1,
				pageSize: limit,
			},
		},
		pageCount: pages,
		manualPagination: true,
		onPaginationChange: (updater) => {
			const newState =
				typeof updater === 'function'
					? updater({ pageIndex: page - 1, pageSize: limit })
					: updater
			const newPage = newState.pageIndex + 1
			const newLimit = newState.pageSize
			router.push(`?page=${newPage}&limit=${newLimit}`)
		},
	})

	return (
		<div className='container mx-auto'>
			<Header table={table} />
			<div className='border rounded-md'>
				<Body table={table} />
			</div>
			<Pagination table={table} />
		</div>
	)
}

export default Table
