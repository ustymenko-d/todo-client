import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react'
import PaginationSelect from './PaginationSelect'
import PaginationButton from './PaginationButton'
import { ITableComponentProps } from '../../Table'
import { FC } from 'react'

const Pagination: FC<ITableComponentProps> = ({ table }) => {
	const pageIndex = table.getState().pagination.pageIndex
	const totalPages = table.getPageCount()

	return (
		<div className='flex flex-wrap-reverse items-center justify-end gap-2 py-4 space-x-6 lg:space-x-8'>
			<PaginationSelect table={table} />

			<div className='flex items-center gap-2'>
				<PaginationButton
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}>
					<ChevronsLeft />
				</PaginationButton>
				<PaginationButton
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					<ChevronLeft />
				</PaginationButton>

				<div className='flex w-[100px] items-center justify-center text-sm font-medium'>
					Page {pageIndex + 1} of {totalPages}
				</div>

				<PaginationButton
					onClick={() => table.setPageIndex(totalPages - 1)}
					disabled={!table.getCanNextPage()}>
					<span className='sr-only'>Go to next page</span>
					<ChevronRight />
				</PaginationButton>
				<PaginationButton
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					<span className='sr-only'>Go to last page</span>
					<ChevronsRight />
				</PaginationButton>
			</div>
		</div>
	)
}

export default Pagination
