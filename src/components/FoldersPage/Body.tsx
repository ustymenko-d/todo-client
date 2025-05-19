'use client'

import useAppStore from '@/store/store'
import { useCallback, useMemo, useState } from 'react'
import EmptyPlaceholder from './components/EmptyPlaceholder'
import Folder from './components/Folder'
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import Task from './components/Task'
import useTaskMove from '@/hooks/useTaskMove'
import useUpdateTasks from '@/hooks/useUpdateTasks'

const Body = () => {
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const [loading, setLoading] = useState(false)
	const [activeId, setActiveId] = useState<string | null>(null)

	const { moveTask } = useTaskMove(setLoading)
	const { handleUpdateTasks } = useUpdateTasks()

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 0,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				distance: 10,
			},
		})
	)

	const activeTask = useMemo(
		() =>
			foldersWithTasks
				.flatMap((folder) => folder.tasks)
				.find((task) => task?.id === activeId) || null,
		[foldersWithTasks, activeId]
	)

	const handleDragStart = ({ active }: DragStartEvent) => {
		if (!loading) setActiveId(String(active.id))
	}

	const handleDragEnd = useCallback(
		async ({ active, over }: DragEndEvent) => {
			if (loading || !over) return

			const taskId = String(active.id)
			const newFolderId = String(over.id)
			const task = foldersWithTasks
				.flatMap((folder) => folder.tasks)
				.find((task) => task?.id === taskId)

			if (!task || task.folderId === newFolderId) return
			handleUpdateTasks('delete', task)
			await moveTask(task, newFolderId)
			setActiveId(null)
		},
		[loading, foldersWithTasks, handleUpdateTasks, moveTask]
	)

	const handleDragCancel = () => {
		if (!loading) setActiveId(null)
	}

	if (!foldersWithTasks?.length) return <EmptyPlaceholder />

	return (
		<div className='grid w-full gap-2 mt-4 lg:grid-cols-2 xl:grid-cols-3 lg:gap-4'>
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}>
				{foldersWithTasks.map((folder) => (
					<Folder
						key={folder.id}
						folder={folder}
					/>
				))}

				<DragOverlay>{activeTask && <Task task={activeTask} />}</DragOverlay>
			</DndContext>
		</div>
	)
}

export default Body
