import {
	IGetTasksResponse,
	ITaskResponse,
	TGetTasksRequest,
	TTaskBase,
	TTaskPayload,
} from '@/types/tasks'
import { ApiAxios } from './Axios'
import { handleApiRequest } from '@/utils/requestHandler'

const TASKS_API_URL = '/tasks'

const TasksService = {
	getTasks: (payload: TGetTasksRequest, config = {}) =>
		handleApiRequest(() =>
			ApiAxios.post<IGetTasksResponse>(`${TASKS_API_URL}/get`, payload, config)
		),

	createTask: (payload: TTaskBase) =>
		handleApiRequest(() =>
			ApiAxios.post<ITaskResponse>(`${TASKS_API_URL}/create`, payload)
		),

	editTask: (payload: TTaskPayload) =>
		handleApiRequest(() =>
			ApiAxios.put<ITaskResponse>(`${TASKS_API_URL}`, payload)
		),

	toggleStatus: (taskId: string) =>
		handleApiRequest(() =>
			ApiAxios.patch<ITaskResponse>(`${TASKS_API_URL}/${taskId}`)
		),

	deleteTask: (taskId: string) =>
		handleApiRequest(() =>
			ApiAxios.delete<ITaskResponse>(`${TASKS_API_URL}/${taskId}`)
		),
}

export default TasksService
