'use client'

import useAppStore from '@/store/store'
import { TTask } from '@/types/tasks'

import TaskCard from '../../TaskCard/TaskCard'

const Subtasks = ({ subtasks }: { subtasks: TTask[] }) => {
	const openTaskDialog = useAppStore((s) => s.openTaskDialog)

	return subtasks.map((task) => {
		const handleOpenDetails = () => openTaskDialog(task)

		return (
			<div
				key={task.id}
				onClick={handleOpenDetails}
				className='cursor-pointer'>
				<TaskCard
					task={task}
					withCheckbox
				/>
			</div>
		)
	})
}

export default Subtasks
