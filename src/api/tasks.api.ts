import { handleApiRequest } from '@/api/requestHandler'
import { IRecaptcha } from '@/types/common'
import {
	IGetTasksResponse,
	ITaskResponse,
	TGetTasksRequest,
	TTaskBase,
	TTaskPayload,
} from '@/types/tasks'

import { ApiAxios } from './Axios'

const TASKS_API_URL = '/tasks'

const TasksAPI = {
	getTasks: (payload: TGetTasksRequest, config = {}) =>
		handleApiRequest<IGetTasksResponse>(() =>
			ApiAxios.post(`${TASKS_API_URL}/get`, payload, config)
		),

	createTask: (payload: TTaskBase & IRecaptcha) =>
		handleApiRequest<ITaskResponse>(() => ApiAxios.post(`${TASKS_API_URL}/create`, payload)),

	editTask: (payload: TTaskPayload) =>
		handleApiRequest<ITaskResponse>(() => ApiAxios.put(`${TASKS_API_URL}`, payload)),

	toggleStatus: (taskId: string) =>
		handleApiRequest<ITaskResponse>(() => ApiAxios.patch(`${TASKS_API_URL}/${taskId}`)),

	deleteTask: (taskId: string) =>
		handleApiRequest<ITaskResponse>(() => ApiAxios.delete(`${TASKS_API_URL}/${taskId}`)),
}

export default TasksAPI
