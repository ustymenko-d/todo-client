'use client'

import { CircleCheck, Loader } from 'lucide-react'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import useBreakpoints from '@/hooks/useBreakpoints'
import { cn } from '@/lib/utils'
import { TTask } from '@/types/tasks'
import { formatValue } from '@/utils/formatting'

import CardCheckbox from './components/CardCheckbox'
import DragHandle, { IDragProps } from './components/DragHandle'

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
	const { widthIndex } = useBreakpoints({ width: [640] })

	const { id, title, completed } = task

	const statusText = completed ? 'Completed' : 'In\u00A0Progress'

	const statusIcon = completed ? (
		<CircleCheck
			className='shrink-0 text-green-500 dark:text-green-400'
			size={16}
			strokeWidth={1}
		/>
	) : (
		<Loader
			className='shrink-0 text-muted-foreground'
			size={16}
			strokeWidth={1}
		/>
	)

	return (
		<div
			ref={dragProps?.setNodeRef}
			{...(dragProps?.attributes || {})}
			className={cn(
				'flex items-stretch border rounded-md transition-opacity bg-white dark:bg-black hover:bg-accent break-words',
				dragProps?.isDragging && 'opacity-50'
			)}>
			{(dragProps || taskInMotion) && (
				<DragHandle
					id={id}
					dragProps={dragProps}
					taskInMotion={taskInMotion}
				/>
			)}

			{withCheckbox && <CardCheckbox task={task} />}

			<div
				className='p-2 border-r grow break-words'
				style={{ wordBreak: 'break-word' }}>
				{formatValue(title)}
			</div>

			<div className='flex items-center gap-2 p-2 sm:min-w-28'>
				{widthIndex > 0 ? (
					<>
						{statusIcon}
						{statusText}
					</>
				) : (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>{statusIcon}</TooltipTrigger>
							<TooltipContent>{statusText}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</div>
	)
}

export default TaskCard
