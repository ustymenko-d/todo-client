import { GetTasksRequestDto, TaskBaseDto } from '@/dto/tasks'
import apiRequestHandler from '@/utils/apiRequestHandler'

const API_URL = '/tasks'

const TasksService = {
	getTasks: (payload: GetTasksRequestDto) =>
		apiRequestHandler<GetTasksRequestDto>(API_URL, 'post', 'get', payload),
	createTask: (payload: TaskBaseDto) =>
		apiRequestHandler<TaskBaseDto>(API_URL, 'post', 'create', payload),
}

export default TasksService
