import { ITableComponentProps } from '@/components/TablePage/components/Table/Table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const PaginationSelect = ({ table }: ITableComponentProps) => {
	const pageSize = table.getState().pagination.pageSize
	const pageSizes = [25, 50, 75, 100]

	return (
		<div className='flex items-center space-x-2'>
			<p className='text-sm font-medium sm:text-base'>Rows per page</p>
			<Select
				value={`${pageSize}`}
				onValueChange={(value) => {
					table.setPageSize(Number(value))
				}}>
				<SelectTrigger className='h-8 w-[70px]'>
					<SelectValue placeholder={pageSize} />
				</SelectTrigger>
				<SelectContent side='top'>
					{pageSizes.map((size) => (
						<SelectItem
							key={size}
							value={`${size}`}>
							{size}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export default PaginationSelect
