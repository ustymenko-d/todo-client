import { TASK_FETCH_LIMIT } from '@/const'

const getTasksKey = (folderId: string) => [
	'tasks',
	{ folderId, limit: TASK_FETCH_LIMIT },
]

export default getTasksKey
