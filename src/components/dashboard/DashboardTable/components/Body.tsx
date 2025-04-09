import { ITableComponentProps } from '../DashboardTable'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'
import columns from './Columns/Columns'

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
						className='border-r last:border-none text-center'>
						{!header.isPlaceholder &&
							flexRender(header.column.columnDef.header, header.getContext())}
					</TableHead>
				))}
			</TableRow>
		))

	const renderRows = () =>
		rows.map((row) => (
			<TableRow key={row.id}>
				{row.getVisibleCells().map((cell) => (
					<TableCell
						key={cell.id}
						className='border-r last:border-none'>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				))}
			</TableRow>
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
