import {
	IGetTasksResponse,
	ITaskResponse,
	TGetTasksRequest,
	TTask,
	TTaskBase,
} from '@/types/tasks'
import { AxiosResponse } from 'axios'
import { ApiAxios } from './Axios'
import RequestHandler from '@/utils/RequestHandler'

const TASKS_API_URL = '/tasks'

const TasksService = {
	getTasks: (
		payload: TGetTasksRequest,
		config = {}
	): Promise<AxiosResponse<IGetTasksResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${TASKS_API_URL}/get`, payload, config)
		),

	createTask: (payload: TTaskBase): Promise<AxiosResponse<ITaskResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${TASKS_API_URL}/create`, payload)
		),

	editTask: (payload: TTask): Promise<AxiosResponse<ITaskResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.put(`${TASKS_API_URL}`, payload)
		),

	toggleStatus: (taskId: string): Promise<AxiosResponse<ITaskResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.patch(`${TASKS_API_URL}/${taskId}`)
		),

	deleteTask: (taskId: string): Promise<AxiosResponse<ITaskResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.delete(`${TASKS_API_URL}/${taskId}`)
		),
}

export default TasksService
