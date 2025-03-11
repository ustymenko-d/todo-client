'use client'

import { TaskBaseDto } from '@/dto/tasks'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<TaskBaseDto>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
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
		accessorKey: 'completed',
		header: 'Completed',
	},
	{
		accessorKey: 'expiresAt',
		header: 'Expires',
	},
]

export default columns
