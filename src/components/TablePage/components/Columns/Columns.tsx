import { formatDate, formatValue } from '@/utils/formatting'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import Header from './Header'
import FolderCell from './FolderCell'
import { TTask } from '@/types/tasks'
import { ChevronRight, CircleCheck, Loader } from 'lucide-react'

const columns: ColumnDef<TTask>[] = [
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<Header
				column={column}
				title='Title'
			/>
		),
		cell: ({ row }) => {
			const canExpand = row.getCanExpand()
			const isExpanded = row.getIsExpanded()

			return (
				<div
					style={{ marginLeft: row.depth * 9 }}
					className='flex items-center gap-2'>
					{formatValue(row.original.title)}
					{canExpand && (
						<Button
							size='icon'
							variant='ghost'
							className='w-7 h-7'
							onClick={(e) => {
								e.stopPropagation()
								row.getToggleExpandedHandler()?.()
							}}>
							<ChevronRight
								className={`duration-200 text-muted-foreground ${
									isExpanded ? 'rotate-90' : ''
								}`}
							/>
							<span className='sr-only'>
								{isExpanded ? 'Collapse' : 'Expand'}
							</span>
						</Button>
					)}
				</div>
			)
		},
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row }) => formatValue(row.original.description),
	},
	{
		accessorKey: 'completed',
		header: 'Status',
		cell: ({ row }) => {
			const { completed } = row.original

			return (
				<div className='flex items-center gap-2'>
					{completed ? (
						<CircleCheck
							className='text-green-500 dark:text-green-400'
							size={16}
							strokeWidth={1}
						/>
					) : (
						<Loader
							className='text-muted-foreground'
							size={16}
							strokeWidth={1}
						/>
					)}
					{completed ? 'Done' : 'In Process'}
				</div>
			)
		},
	},
	{
		accessorKey: 'folderId',
		header: 'Folder',
		cell: ({ row }) => <FolderCell id={row.original.folderId ?? ''} />,
	},
	{
		accessorKey: 'startDate',
		header: ({ column }) => (
			<Header
				column={column}
				title='Start Date'
			/>
		),
		cell: ({ row }) => formatDate(row.original.startDate),
	},
	{
		accessorKey: 'expiresDate',
		header: ({ column }) => (
			<Header
				column={column}
				title='Expires Date'
			/>
		),
		cell: ({ row }) => formatDate(row.original.expiresDate),
	},
]

export default columns
