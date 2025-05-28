'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
	IGetTasksResponse,
	TasksInfiniteData,
	TTask,
	TTaskPayload,
} from '@/types/tasks'
import getTasksKey from '@/utils/getTasksKey'

import useActions from './useActions'

const useMove = (setLoading: (loading: boolean) => void) => {
	const queryClient = useQueryClient()
	const { handleTaskAction } = useActions('edit')

	const moveTask = async (task: TTask, newFolderId: string) => {
		const oldFolderId = task.folderId
		const updatedTask: TTask = { ...task, folderId: newFolderId }

		if (!oldFolderId) {
			console.error('Old folder id is undefined')
			return
		}

		queryClient.setQueriesData<TasksInfiniteData>(
			{ queryKey: getTasksKey(oldFolderId) },
			(oldData) => {
				if (!oldData) return oldData

				return {
					...oldData,
					pages: oldData.pages.map((page: IGetTasksResponse) => ({
						...page,
						tasks: page.tasks.filter((t) => t.id !== task.id),
						total: page.total - 1,
						pages: Math.ceil((page.total - 1) / page.limit),
					})),
				}
			}
		)

		queryClient.setQueriesData<TasksInfiniteData>(
			{ queryKey: getTasksKey(newFolderId) },
			(oldData) => {
				if (!oldData) return oldData

				return {
					...oldData,
					pages: oldData.pages.map((page: IGetTasksResponse, index: number) => {
						if (index === 0) {
							return {
								...page,
								tasks: [updatedTask, ...page.tasks],
								total: page.total + 1,
								pages: Math.ceil((page.total + 1) / page.limit),
							}
						}

						return page
					}),
				}
			}
		)

		try {
			await handleTaskAction(setLoading, createPayload(task, newFolderId))
		} catch (error) {
			toast.error('Failed to move the task. Data will be reloaded.')
			console.error('Task move failed:', error)

			queryClient.invalidateQueries({
				queryKey: getTasksKey(oldFolderId),
			})
			queryClient.invalidateQueries({
				queryKey: getTasksKey(newFolderId),
			})
		}
	}

	return { moveTask }
}

const createPayload = (task: TTask, newFolderId: string): TTaskPayload => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { subtasks, lastEdited, ...updatedTask } = {
		...task,
		folderId: newFolderId,
	}

	return updatedTask
}

export default useMove
