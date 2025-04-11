import apiRequestHandler from '@/utils/apiRequestHandler'
import { GetTasksRequestDto, TaskBaseDto, TaskDto } from '@/dto/tasks'
import { IGetTasksResponse, ITaskResponse } from '@/types/tasks'
import { AxiosResponse } from 'axios'

const API_URL = '/tasks'

const TasksService = {
	getTasks: (
		payload: GetTasksRequestDto
	): Promise<AxiosResponse<IGetTasksResponse>> =>
		apiRequestHandler<IGetTasksResponse, GetTasksRequestDto>(
			`${API_URL}/get`,
			'post',
			payload
		),

	createTask: (payload: TaskBaseDto): Promise<AxiosResponse<ITaskResponse>> =>
		apiRequestHandler<ITaskResponse, TaskBaseDto>(
			`${API_URL}/create`,
			'post',
			payload
		),

	editTask: (payload: TaskDto): Promise<AxiosResponse<ITaskResponse>> =>
		apiRequestHandler<ITaskResponse>(API_URL, 'put', payload),

	toggleStatus: (taskId: string): Promise<AxiosResponse<ITaskResponse>> =>
		apiRequestHandler<ITaskResponse>(`${API_URL}/${taskId}`, 'patch'),

	deleteTask: (taskId: string): Promise<AxiosResponse<ITaskResponse>> =>
		apiRequestHandler<ITaskResponse>(`${API_URL}/${taskId}`, 'delete'),
}

export default TasksService
