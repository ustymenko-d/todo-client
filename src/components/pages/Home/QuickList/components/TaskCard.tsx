import { CircleCheck, Loader } from 'lucide-react'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import useActions from '@/hooks/tasks/useActions'
import { TTask } from '@/types/tasks'
import { formatValue } from '@/utils/formatting'

const TaskCard = ({ task }: { task: TTask }) => {
	const [isToggling, setIsToggling] = useState(false)
	const { handleTaskAction: changeTaskStatus } = useActions(
		'changeStatus',
		task
	)

	const toggleStatus = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (!isToggling) changeTaskStatus(setIsToggling)
	}

	const { title, completed } = task

	return (
		<div className='flex items-stretch pr-2 transition-opacity bg-white border rounded-md cursor-pointer dark:bg-black hover:bg-accent'>
			<div
				onClick={toggleStatus}
				className='flex items-center justify-center px-2 border-r text-muted-foreground'>
				<Checkbox
					checked={completed}
					disabled={isToggling}
					className='w-[18px] h-[18px] rounded-full'
				/>
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

export default TaskCard
