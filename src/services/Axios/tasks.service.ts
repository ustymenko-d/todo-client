import { GetTasksRequestDto, TaskBaseDto, TaskDto } from '@/dto/tasks'
import { IGetTasksResponse, ITaskResponse } from '@/types/tasks'
import { AxiosResponse } from 'axios'
import { ApiAxios } from './Axios'
import RequestHandler from '@/utils/RequestHandler'

const TASKS_API_URL = '/tasks'

const TasksService = {
	getTasks: (
		payload: GetTasksRequestDto,
		config = {}
	): Promise<AxiosResponse<IGetTasksResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${TASKS_API_URL}/get`, payload, config)
		),

	createTask: (payload: TaskBaseDto): Promise<AxiosResponse<ITaskResponse>> =>
		RequestHandler.handleRequest(() =>
			ApiAxios.post(`${TASKS_API_URL}/create`, payload)
		),

	editTask: (payload: TaskDto): Promise<AxiosResponse<ITaskResponse>> =>
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
