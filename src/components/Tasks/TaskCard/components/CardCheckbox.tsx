import { MouseEvent, useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import useActions from '@/hooks/tasks/useActions'
import { cn } from '@/lib/utils'
import { TResponseState } from '@/types/common'
import { TTask } from '@/types/tasks'

const CardCheckbox = ({ task }: { task: TTask }) => {
	const [status, setStatus] = useState<TResponseState>('default')

	const { handleTaskAction: changeTaskStatus } = useActions('changeStatus', task)

	const isPending = status === 'pending'

	const toggleStatus = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (!isPending) changeTaskStatus(setStatus)
	}

	return (
		<div
			onClick={toggleStatus}
			className={cn(
				'flex items-center justify-center px-2 border-r text-muted-foreground',
				isPending ? 'cursor-not-allowed' : 'cursor-pointer'
			)}>
			<Checkbox
				checked={task?.completed}
				disabled={isPending}
				className='w-[18px] h-[18px] rounded-full'
			/>
		</div>
	)
}

export default CardCheckbox
