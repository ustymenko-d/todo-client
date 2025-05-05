'use client'

import useAppStore from '@/store/store'
import { TTask } from '@/types/tasks'
import { formatValue } from '@/utils/formatting'
import { CircleCheck, Loader } from 'lucide-react'

const Task = ({ task }: { task: TTask }) => {
	const openTaskDialog = useAppStore((state) => state.openTaskDialog)
	const { title, completed } = task

	return (
		<div
			onClick={() => openTaskDialog(task)}
			className='flex px-2 border rounded-md cursor-pointer hover:bg-accent'>
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
