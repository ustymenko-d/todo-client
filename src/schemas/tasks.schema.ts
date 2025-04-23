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
	title: z
		.string()
		.min(2, { message: 'The title must be at least 2 characters long.' })
		.nonempty({ message: 'The title is required.' }),

	description: z.string().nullable().optional(),

	completed: z.boolean({ message: 'Invalid value.' }),

	parentTaskId: z.string().nullable().optional(),

	expiresAt: z.date().nullable().optional(),

	folderId: z.string().uuid().nullable().optional(),
})

const taskPayload = taskBase.omit({
	completed: true,
})

const task: z.ZodSchema = taskBase.extend({
	id: z.string(),
	userId: z.string(),
	createdAt: z.date(),
	subtasks: z.array(z.lazy((): z.ZodSchema => task)),
})

const TasksValidation = {
	getTasksRequest,
	taskBase,
	taskPayload,
	task,
}

export default TasksValidation
