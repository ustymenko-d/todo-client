'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	ColumnFiltersState,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	Table as TanstackTable,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import columns from '@/components/TablePage/components/Columns/Columns'
import Head from '@/components/TablePage/components/Head'
import Body from '@/components/TablePage/components/Body'
import Pagination from '@/components/TablePage/components/Pagination/Pagination'
import { TTask } from '@/types/tasks'

interface TableProps {
	data: TTask[] | []
	pagination: {
		page: number
		limit: number
		pages: number
	}
}

export interface ITableComponentProps {
	table: TanstackTable<TTask>
}

const Table = ({ data, pagination }: TableProps) => {
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
		getExpandedRowModel: getExpandedRowModel(),
		getSubRows: (row) => row.subtasks,
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
			<Head table={table} />
			<Body table={table} />
			<Pagination table={table} />
		</div>
	)
}

export default Table
