import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react'
import PaginationSelect from './PaginationSelect'
import { ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { ITableComponentProps } from '@/components/TablePage/Table'

const Pagination = ({ table }: ITableComponentProps) => {
	const { pageIndex } = table.getState().pagination
	const totalPages = table.getPageCount()

	const renderButton = (
		onClick: () => void,
		disabled: boolean,
		label: string,
		icon: ReactElement
	) => (
		<Button
			variant='outline'
			className='w-8 h-8 p-0'
			onClick={onClick}
			disabled={disabled}>
			<span className='sr-only'>{label}</span>
			{icon}
		</Button>
	)

	return (
		<div className='flex flex-wrap-reverse items-center justify-end gap-2 py-4 space-x-6 lg:space-x-8'>
			<PaginationSelect table={table} />

			<div className='flex items-center gap-2'>
				{renderButton(
					() => table.setPageIndex(0),
					!table.getCanPreviousPage(),
					'Go to first page',
					<ChevronsLeft />
				)}
				{renderButton(
					() => table.previousPage(),
					!table.getCanPreviousPage(),
					'Go to previous page',
					<ChevronLeft />
				)}

				<div className='flex w-[100px] items-center justify-center text-sm font-medium'>
					Page {pageIndex + 1} of {totalPages}
				</div>

				{renderButton(
					() => table.nextPage(),
					!table.getCanNextPage(),
					'Go to next page',
					<ChevronRight />
				)}
				{renderButton(
					() => table.setPageIndex(totalPages - 1),
					!table.getCanNextPage(),
					'Go to last page',
					<ChevronsRight />
				)}
			</div>
		</div>
	)
}

export default Pagination
