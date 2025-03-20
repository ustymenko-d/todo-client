import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { ITableComponentProps } from '../Table'
import { flexRender } from '@tanstack/react-table'
import columns from './Columns/Columns'
import { FC, Fragment } from 'react'
import SubtasksTable from './SubtasksTable/SubtasksTable'
import { ITask } from '@/types/task.types'

const Body: FC<ITableComponentProps> = ({ table }) => {
	return (
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
						const { id, subtasks } = row.original as ITask

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
											className='bg-muted p-1.5 pr-0'>
											<SubtasksTable
												data={subtasks}
												classNames='border border-r-0 bg-white'
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
	)
}

export default Body
