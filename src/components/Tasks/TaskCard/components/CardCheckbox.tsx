import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import useActions from '@/hooks/tasks/useActions'
import { cn } from '@/lib/utils'
import { TTask } from '@/types/tasks'

const CardCheckbox = ({ task }: { task: TTask }) => {
	const [isToggling, setIsToggling] = useState(false)

	const { handleTaskAction: changeTaskStatus } = useActions(
		'changeStatus',
		task
	)

	const toggleStatus = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (!isToggling) changeTaskStatus(setIsToggling)
	}

	return (
		<div
			onClick={toggleStatus}
			className={cn(
				'flex items-center justify-center px-2 border-r text-muted-foreground',
				isToggling ? 'cursor-not-allowed' : 'cursor-pointer'
			)}>
			<Checkbox
				checked={task?.completed}
				disabled={isToggling}
				className='w-[18px] h-[18px] rounded-full'
			/>
		</div>
	)
}

export default CardCheckbox
