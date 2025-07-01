import { Cell, flexRender, Row as TanstackRow } from '@tanstack/react-table'

import TaskContextMenu from '@/components/Tasks/TaskContextMenu'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { TTask } from '@/types/tasks'

const depthBgMap: Record<number, string> = {
	0: 'bg-white dark:bg-neutral-900',
	1: 'bg-neutral-100 dark:bg-neutral-800',
	2: 'bg-neutral-200 dark:bg-neutral-700',
	3: 'bg-neutral-300 dark:bg-neutral-600',
	4: 'bg-neutral-400 dark:bg-neutral-500',
}

const Row = ({ row }: { row: TanstackRow<TTask> }) => (
	<TaskContextMenu task={row.original} inTable>
		<TableRow className={cn(depthBgMap[row.depth])}>
			{row.getVisibleCells().map((cell: Cell<TTask, unknown>) => (
				<TableCell
					key={cell.id}
					className='border-r cursor-pointer select-none lg:text-base last:border-none'>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	</TaskContextMenu>
)

export default Row
