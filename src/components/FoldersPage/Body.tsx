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
import useMove from '@/hooks/tasks/useMove'
import Loader from '../ui/Loader'

const Body = () => {
	const foldersHydrated = useAppStore((state) => state.foldersHydrated)
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const [loading, setLoading] = useState(false)
	const [activeId, setActiveId] = useState<string | null>(null)

	const { moveTask } = useMove(setLoading)

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

			await moveTask(task, newFolderId)

			setActiveId(null)
		},
		[foldersWithTasks, loading, moveTask]
	)

	const handleDragCancel = () => {
		if (!loading) setActiveId(null)
	}

	if (!foldersWithTasks?.length)
		return foldersHydrated ? <EmptyPlaceholder /> : <Loader />

	return (
		<div className='grid w-full gap-2 lg:grid-cols-2 xl:grid-cols-3 lg:gap-4'>
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
