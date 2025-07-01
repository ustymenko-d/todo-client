import { useDraggable } from '@dnd-kit/core'

import TaskCard from '@/components/Tasks/TaskCard'
import { TTask } from '@/types/tasks'

const DraggableItem = ({ task }: { task: TTask }) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task.id,
		data: {
			task,
		},
	})

	const isDragging = !!transform

	return (
		<TaskCard
			task={task}
			dragProps={{ attributes, listeners, setNodeRef, isDragging }}
		/>
	)
}

export default DraggableItem
