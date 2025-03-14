import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { TableComponentsProps } from '../../Table'

const PaginationSelect = <TData,>({ table }: TableComponentsProps<TData>) => {
	const pageSize = table.getState().pagination.pageSize
	const pageSizes = [5, 10, 20, 30, 40, 50]

	return (
		<div className='flex items-center space-x-2'>
			<p className='text-sm font-medium'>Rows per page</p>
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
