'use client'

import useAppStore from '@/store/store'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import FoldersService from '@/services/folders.service'
import EmptyPlaceholder from './EmptyPlaceholder'
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

const Body = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const [loadingArray, setLoadingArray] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	const [activeId, setActiveId] = useState<string | null>(null)

	const { moveTask } = useTaskMove(setLoading)

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

	const isFolderLoading = useCallback(
		(id: string) => loadingArray.includes(id),
		[loadingArray]
	)

	const activeTask = useMemo(
		() =>
			foldersWithTasks
				.flatMap((folder) => folder.tasks)
				.find((task) => task.id === activeId) || null,
		[foldersWithTasks, activeId]
	)

	const handleDeleteFolder = async (id: string) => {
		try {
			setLoadingArray((prev) => [...prev, id])
			const { data } = await FoldersService.deleteFolder(id)
			const { success, message } = data
			if (success) {
				toast.success(message)
				if (accountInfo) {
					setAccountInfo((prev) => ({
						...prev!,
						folders: prev?.folders?.filter((folder) => folder.id !== id),
					}))
				}
				setFoldersWithTasks((prev) => prev.filter((f) => f.id !== id))
			}
		} catch (error) {
			toast.error('Something went wrong!')
			console.error('Delete Folder Error:', error)
		} finally {
			setLoadingArray((prev) => prev.filter((element) => element !== id))
		}
	}

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
				.find((t) => t.id === taskId)

			if (!task || task.folderId === newFolderId) return

			await moveTask(task, newFolderId)
			setActiveId(null)
		},
		[loading, foldersWithTasks, moveTask]
	)

	const handleDragCancel = () => {
		if (!loading) setActiveId(null)
	}

	if (!accountInfo?.folders?.length) return <EmptyPlaceholder />

	return (
		<div className='grid w-full gap-2 mt-4 lg:grid-cols-2 xl:grid-cols-3 lg:gap-4'>
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}>
				{accountInfo.folders.map((folder) => (
					<Folder
						key={folder.id}
						folder={folder}
						isLoading={isFolderLoading(folder.id)}
						onEdit={() => openEditor('edit', folder)}
						onDelete={() => handleDeleteFolder(folder.id)}
					/>
				))}

				<DragOverlay>{activeTask && <Task task={activeTask} />}</DragOverlay>
			</DndContext>
		</div>
	)
}

export default Body
