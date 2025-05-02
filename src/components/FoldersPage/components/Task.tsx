import { TTask } from '@/types/tasks'
import { formatValue } from '@/utils/formatting'
import { CircleCheck, Loader } from 'lucide-react'

const Task = ({ task }: { task: TTask }) => {
	const { title, completed } = task
	return (
		<div className='flex px-2 border rounded-md'>
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
