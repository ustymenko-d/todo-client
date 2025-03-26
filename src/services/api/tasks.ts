import apiRequestHandler from '@/utils/apiRequestHandler'
import { GetTasksRequestDto, TaskBaseDto, TaskDto } from '@/dto/tasks'
import { IGetTasksResponse, ITaskResponse } from '@/types/tasks'

const API_URL = '/tasks'

const TasksService = {
	getTasks: (payload: GetTasksRequestDto): Promise<IGetTasksResponse> =>
		apiRequestHandler<IGetTasksResponse, GetTasksRequestDto>(
			`${API_URL}/get`,
			'post',
			payload
		),

	createTask: (payload: TaskBaseDto): Promise<ITaskResponse> =>
		apiRequestHandler<ITaskResponse, TaskBaseDto>(
			`${API_URL}/create`,
			'post',
			payload
		),

	editTask: (payload: TaskDto): Promise<ITaskResponse> =>
		apiRequestHandler<ITaskResponse>(API_URL, 'put', payload),

	toggleStatus: (taskId: string): Promise<ITaskResponse> =>
		apiRequestHandler<ITaskResponse>(`${API_URL}/${taskId}`, 'patch'),

	deleteTask: (taskId: string): Promise<ITaskResponse> =>
		apiRequestHandler<ITaskResponse>(`${API_URL}/${taskId}`, 'delete'),
}

export default TasksService
