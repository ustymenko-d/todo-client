'use client'

import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { CircleCheck, GripVertical, Loader } from 'lucide-react'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import useActions from '@/hooks/tasks/useActions'
import { cn } from '@/lib/utils'
import { TTask } from '@/types/tasks'
import { formatValue } from '@/utils/formatting'

interface IDragProps {
	attributes: DraggableAttributes
	listeners: SyntheticListenerMap | undefined
	setNodeRef: (node: HTMLElement | null) => void
	isDragging: boolean
}

interface ITaskCardProps {
	task: TTask
	withCheckbox?: boolean
	dragProps?: IDragProps
	taskInMotion?: string | null
}

const TaskCard = ({
	task,
	withCheckbox = false,
	dragProps,
	taskInMotion,
}: ITaskCardProps) => {
	const [isToggling, setIsToggling] = useState(false)

	const { handleTaskAction: changeTaskStatus } = useActions(
		'changeStatus',
		task
	)

	const { title, completed } = task

	const toggleStatus = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (!isToggling) changeTaskStatus(setIsToggling)
	}

	return (
		<div
			ref={dragProps?.setNodeRef}
			{...(dragProps?.attributes || {})}
			className={cn(
				'flex items-stretch pr-2 border rounded-md transition-opacity bg-white dark:bg-black hover:bg-accent',
				dragProps?.isDragging && 'opacity-50'
			)}>
			{(dragProps || taskInMotion) && (
				<div
					{...(dragProps?.listeners || {})}
					onClick={(e) => e.stopPropagation()}
					className={cn(
						'flex items-center justify-center px-2 text-muted-foreground border-r',
						taskInMotion === task.id ? 'cursor-grabbing' : 'cursor-grab'
					)}>
					<GripVertical size={18} />
				</div>
			)}

			{withCheckbox && (
				<div
					onClick={toggleStatus}
					className={cn(
						'flex items-center justify-center px-2 border-r text-muted-foreground',
						isToggling ? 'cursor-not-allowed' : 'cursor-pointer'
					)}>
					<Checkbox
						checked={completed}
						disabled={isToggling}
						className='w-[18px] h-[18px] rounded-full'
					/>
				</div>
			)}

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

export default TaskCard
