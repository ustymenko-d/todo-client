import { ColumnDef } from '@tanstack/react-table'
import { TaskDto } from '@/dto/tasks'
import ColumnHeader from './ColumnHeader'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, CircleCheckBig, Hourglass } from 'lucide-react'
import formatDate from '@/utils/formatDate'

const formatValue = (value: string | null): ReactNode => {
	if (!value) return '-'
	const stringValue = String(value)
	if (stringValue.length <= 30) return <p>{stringValue}</p>
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<p>{stringValue.slice(0, 30) + '…'}</p>
				</TooltipTrigger>
				<TooltipContent>
					<p>{stringValue}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

const columns: ColumnDef<TaskDto>[] = [
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<ColumnHeader
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
						<CircleCheckBig
							className='text-muted-foreground'
							size={18}
							strokeWidth={1}
						/>
					) : (
						<Hourglass
							className='text-muted-foreground'
							size={18}
							strokeWidth={1}
						/>
					)}
					{completed ? 'Done' : 'In Progress'}
				</div>
			)
		},
	},
	{
		accessorKey: 'folderId',
		header: 'Folder',
		cell: ({ row }) => formatValue(row.original.folderId),
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Created'
			/>
		),
		cell: ({ row }) => formatDate(row.original.createdAt),
	},
	{
		accessorKey: 'expiresAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Expires'
			/>
		),
		cell: ({ row }) => formatDate(row.original.expiresAt),
	},
]

export default columns
