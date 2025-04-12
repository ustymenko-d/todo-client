import { GetTasksRequestDto, TaskBaseDto, TaskDto } from '@/dto/tasks'
import { IGetTasksResponse, ITaskResponse } from '@/types/tasks'
import { AxiosResponse } from 'axios'
import { ApiAxios } from './Axios'
import RequestHandler from '@/utils/RequestHandler'

const TASKS_API_URL = '/tasks'

const TasksService = {
	getTasks: (
		payload: GetTasksRequestDto
	): Promise<AxiosResponse<IGetTasksResponse>> =>
		RequestHandler.request<IGetTasksResponse, GetTasksRequestDto>(
			`${TASKS_API_URL}/get`,
			'post',
			payload
		),

	createTask: (payload: TaskBaseDto): Promise<AxiosResponse<ITaskResponse>> =>
		ApiAxios.post(`${TASKS_API_URL}/create`, payload),

	editTask: (payload: TaskDto): Promise<AxiosResponse<ITaskResponse>> =>
		ApiAxios.put(`${TASKS_API_URL}`, payload),

	toggleStatus: (taskId: string): Promise<AxiosResponse<ITaskResponse>> =>
		ApiAxios.patch(`${TASKS_API_URL}/${taskId}`),

	deleteTask: (taskId: string): Promise<AxiosResponse<ITaskResponse>> =>
		ApiAxios.delete(`${TASKS_API_URL}/${taskId}`),
}

export default TasksService
