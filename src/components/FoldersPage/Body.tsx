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
} from '@dnd-kit/core'
import Task from './components/Task'
import useTaskActions from '@/hooks/useTaskActions'
import { TTask } from '@/types/tasks'

const Body = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)
	const openEditor = useAppStore((state) => state.openFolderEditor)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const [loadingArray, setLoadingArray] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	const [activeId, setActiveId] = useState<string | null>(null)

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

	const { handleTaskAction } = useTaskActions('edit')

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
			setLoadingArray((prev) => prev.filter((element) => element !== id))
			toast.error('Something went wrong!')
			console.error('Error:', error)
		} finally {
			setLoadingArray((prev) => prev.filter((element) => element !== id))
		}
	}

	const handleDragStart = ({ active }: DragStartEvent) => {
		if (!loading) setActiveId(String(active.id))
	}

	const handleDragEnd = useCallback(
		({ active, over }: DragEndEvent) => {
			if (loading || !over) return

			const newFolderId = over.id
			const sourceFolder = foldersWithTasks.find((f) =>
				f.tasks.some((t) => t.id === active.id)
			)
			const task = sourceFolder?.tasks.find((t) => t.id === active.id)
			if (!task || task.folderId === newFolderId) return

			const prevFolderId = task.folderId

			setFoldersWithTasks((prev) =>
				prev.map((folder) =>
					folder.id === prevFolderId
						? { ...folder, tasks: folder.tasks.filter((t) => t.id !== task.id) }
						: folder
				)
			)

			const updatedTask: Partial<TTask> = {
				...task,
				folderId: String(newFolderId),
			}

			delete updatedTask.subtasks
			delete updatedTask.lastEdited

			handleTaskAction(setLoading, updatedTask as TTask, prevFolderId)
			setActiveId(null)
		},
		[loading, foldersWithTasks, handleTaskAction, setFoldersWithTasks]
	)

	const handleDragCancel = () => {
		if (!loading) setActiveId(null)
	}

	if (!accountInfo?.folders?.length) return <EmptyPlaceholder />

	return (
		<div className='grid w-full gap-2 mt-4 lg:grid-cols-2 xl:grid-cols-3 lg:gap-4'>
			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}>
				{accountInfo?.folders?.map((folder) => (
					<Folder
						key={folder.id}
						folder={folder}
						isLoading={isFolderLoading(folder.id)}
						onEdit={() => openEditor('edit', folder)}
						onDelete={() => handleDeleteFolder(folder.id)}
					/>
				))}

				<DragOverlay>
					{activeTask ? <Task task={activeTask} /> : null}
				</DragOverlay>
			</DndContext>
		</div>
	)
}

export default Body
