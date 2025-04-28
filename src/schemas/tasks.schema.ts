import { z } from 'zod'

const getTasksRequest = z.object({
	page: z
		.number()
		.int({ message: 'Must be an integer.' })
		.positive({ message: 'Must be a positive number greater than zero.' })
		.min(1, { message: 'Must be at least 1.' }),

	limit: z
		.number()
		.int({ message: 'Must be an integer.' })
		.positive({ message: 'Must be a positive number greater than zero.' })
		.min(1, { message: 'Must be at least 1.' }),

	title: z
		.string()
		.optional()
		.refine((val) => val === undefined || val.length > 0, {
			message: 'Invalid value.',
		}),

	completed: z.boolean().optional(),

	topLayerTasks: z.boolean().optional(),

	folderId: z.string().uuid().nullable().optional(),
})

const taskBase = z.object({
	title: z.string().nonempty().max(50),

	description: z.string().max(300).nullable().optional(),

	completed: z.boolean().optional(),

	parentTaskId: z.string().uuid().nullable().optional(),

	startDate: z.date().nullable().optional(),

	expiresDate: z.date().nullable().optional(),

	folderId: z.string().uuid().nullable().optional(),
})

const task = taskBase.extend({
	id: z.string(),
	userId: z.string(),
	subtasks: z.array(z.lazy((): z.ZodSchema => task)),
})

const TasksValidation = {
	getTasksRequest,
	taskBase,
	task,
}

export default TasksValidation
