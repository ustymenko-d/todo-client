import { ColumnDef } from '@tanstack/react-table'
import { TaskDto } from '@/dto/tasks'
import ColumnHeader from './ColumnHeader'
import ActionMenu from './ActionMenu'

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
	},
	{
		accessorKey: 'expiresAt',
		header: ({ column }) => (
			<ColumnHeader
				column={column}
				title='Expires'
			/>
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => <ActionMenu task={row.original} />,
	},
]

export default columns
