import apiRequestHandler from '@/utils/apiRequestHandler'
import { GetTasksRequestDto, TaskBaseDto, TaskDto } from '@/dto/tasks'

const API_URL = '/tasks'

const TasksService = {
	getTasks: (payload: GetTasksRequestDto) =>
		apiRequestHandler<GetTasksRequestDto>(API_URL, 'post', 'get', payload),
	createTask: (payload: TaskBaseDto) =>
		apiRequestHandler<TaskBaseDto>(API_URL, 'post', 'create', payload),
	editTask: (payload: TaskDto) =>
		apiRequestHandler(API_URL, 'put', '', payload),
	toggleStatus: (taskId: string) =>
		apiRequestHandler(API_URL, 'patch', `${taskId}`),
	deleteTask: (taskId: string) =>
		apiRequestHandler(API_URL, 'delete', `${taskId}`),
}

export default TasksService
