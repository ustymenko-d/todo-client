import useAppStore from '@/store/store'
import { IGetTasksResponse } from '@/types/tasks'

const useMergeFetchedTasks = () => {
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const mergeFetchedTasks = (folderId: string, data: IGetTasksResponse) => {
		const { tasks, page, pages, limit, total } = data

		setFoldersWithTasks((prev) => {
			return prev.map((folder) => {
				if (folder.id !== folderId) return folder

				const existingTasks = folder.tasks || []
				const newTasks = tasks.filter(
					(task) => !existingTasks.some((t) => t.id === task.id)
				)

				return {
					...folder,
					tasks: [...existingTasks, ...newTasks],
					page,
					pages,
					total,
					limit,
				}
			})
		})
	}

	return { mergeFetchedTasks }
}

export default useMergeFetchedTasks
