'use client'

import { cn } from '@/lib/utils'
import useAppStore from '@/store/store'
import { TTask } from '@/types/tasks'
import { formatValue } from '@/utils/formatting'
import { useDraggable } from '@dnd-kit/core'
import { CircleCheck, GripVertical, Loader } from 'lucide-react'

const Task = ({ task }: { task: TTask }) => {
	const openTaskDialog = useAppStore((state) => state.openTaskDialog)
	const { title, completed } = task
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task.id,
	})
	const isDragging = !!transform

	const handleOpenDetails = () => {
		openTaskDialog(task)
	}

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			onClick={handleOpenDetails}
			className={cn(
				'flex items-stretch pr-2 border rounded-md transition-opacity bg-white dark:bg-black hover:bg-accent',
				isDragging && 'opacity-50'
			)}>
			<div
				{...listeners}
				onClick={(e) => e.stopPropagation()}
				className='cursor-grab flex items-center justify-center px-2 text-muted-foreground border-r'>
				<GripVertical size={18} />
			</div>
			<h4 className='p-2 border-r grow'>{formatValue(title)}</h4>
			<div className='flex items-center gap-2 p-2 min-w-28'>
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
				{completed ? 'Done' : 'In\u00A0Process'}
			</div>
		</div>
	)
}

export default Task
