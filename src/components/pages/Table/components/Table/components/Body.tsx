import { flexRender } from '@tanstack/react-table'

import { ITableComponentProps } from '@/components/pages/Table/components/Table/Table'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import columns from './Columns/Columns'
import Row from './Row'

const Body = ({ table }: ITableComponentProps) => {
	const rows = table.getRowModel().rows

	const renderHeaders = () =>
		table.getHeaderGroups().map((headerGroup) => (
			<TableRow
				key={headerGroup.id}
				className='bg-muted'>
				{headerGroup.headers.map((header) => (
					<TableHead
						key={header.id}
						className='text-center border-r lg:text-base last:border-none'>
						{!header.isPlaceholder &&
							flexRender(header.column.columnDef.header, header.getContext())}
					</TableHead>
				))}
			</TableRow>
		))

	const renderRows = () =>
		rows.map((row) => (
			<Row
				key={row.id}
				row={row}
			/>
		))

	if (rows.length === 0) {
		return (
			<div className='border rounded-md'>
				<Table>
					<TableHeader>{renderHeaders()}</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className='h-24 text-center'>
								No results.
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		)
	}

	return (
		<div className='border rounded-md'>
			<Table>
				<TableHeader>{renderHeaders()}</TableHeader>
				<TableBody>{renderRows()}</TableBody>
			</Table>
		</div>
	)
}

export default Body
