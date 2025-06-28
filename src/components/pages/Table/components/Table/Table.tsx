'use client'

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
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Body from '@/components/pages/Table/components/Table/components/Body'
import columns from '@/components/pages/Table/components/Table/components/Columns/Columns'
import Head from '@/components/pages/Table/components/Table/components/Head'
import Pagination from '@/components/pages/Table/components/Table/components/Pagination/Pagination'
import { TTask } from '@/types/tasks'

import Loader from '../../../../ui/Loader'

interface TableProps {
	data: TTask[] | []
	isFetching: boolean
	pagination: {
		page: number
		limit: number
		pages: number
	}
}

export interface ITableComponentProps {
	table: TanstackTable<TTask>
}

const Table = ({ data, isFetching, pagination }: TableProps) => {
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

			{isFetching && (
				<Loader
					className='justify-end'
					text='Data is fetching'
				/>
			)}
		</div>
	)
}

export default Table
