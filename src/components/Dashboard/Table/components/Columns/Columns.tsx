import { ColumnDef } from '@tanstack/react-table'
import { TaskDto } from '@/dto/tasks'
import ColumnHeader from './ColumnHeader'
import ActionMenu from './ActionMenu'

const formatDate = (dateString?: string): string => {
	if (!dateString) return '-'
	const date = new Date(dateString)
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
	})
}

const columns: ColumnDef<TaskDto>[] = [
	{
		accessorKey: 'completed',
		header: 'Completed',
	},
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Title'
			/>
		),
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'folderId',
		header: 'Folder',
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Created'
			/>
		),
		cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
	},
	{
		accessorKey: 'expiresAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Expires'
			/>
		),
		cell: ({ row }) => <div>{formatDate(row.original.expiresAt)}</div>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <ActionMenu task={row.original} />,
	},
]

export default columns
