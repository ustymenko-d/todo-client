'use client'

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { useCallback, useEffect, useState } from 'react'

import useFetch from '@/hooks/folders/useFetch'
import useMove from '@/hooks/tasks/useMove'
import useAppStore from '@/store/store'

import Loader from '../ui/Loader'
import EmptyPlaceholder from './components/EmptyPlaceholder'
import Folder from './components/Folder'
import Task from './components/Task'

const Body = () => {
	const { data, isLoading, isFetching, isSuccess, isError } = useFetch({
		page: 1,
		limit: 25,
	})

	const setIsFetching = useAppStore((s) => s.setIsFetching)
	const taskInMotion = useAppStore((s) => s.taskInMotion)
	const setTaskInMotion = useAppStore((s) => s.setTaskInMotion)

	useEffect(() => {
		setIsFetching(isFetching)
	}, [isFetching, setIsFetching])

	const [loading, setLoading] = useState(false)

	const { moveTask } = useMove(setLoading)

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 150,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor)
	)

	const handleDragStart = ({ active }: DragStartEvent) => {
		const task = active.data?.current?.task
		if (task && !loading) setTaskInMotion(task)
	}

	const handleDragEnd = useCallback(
		async ({ active, over }: DragEndEvent) => {
			if (loading || !over) return

			const { task } = active.data.current ?? {}
			const newFolderId = String(over.id)

			if (!task || task.folderId === newFolderId) return

			await moveTask(task, newFolderId)

			setTaskInMotion(null)
		},
		[loading, moveTask, setTaskInMotion]
	)

	const handleDragCancel = () => {
		if (!loading) setTaskInMotion(null)
	}

	if (isLoading) return <Loader />

	if (isSuccess && data.folders.length === 0) return <EmptyPlaceholder />

	if (isError) return <button>reload</button>

	return (
		<div className='grid w-full gap-2 lg:grid-cols-2 xl:grid-cols-3 lg:gap-4'>
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}>
				{data?.folders.map((folder) => (
					<Folder
						key={folder.id}
						folder={folder}
					/>
				))}

				{taskInMotion && (
					<DragOverlay>
						<Task task={taskInMotion} />
					</DragOverlay>
				)}
			</DndContext>
		</div>
	)
}

export default Body
