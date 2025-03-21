import { z } from 'zod'
import { paginationSchema } from './commonSchema'

const getTasksRequestSchema = paginationSchema.extend({
	title: z
		.string()
		.optional()
		.refine((val) => val === undefined || val.length > 0, {
			message: 'Invalid value.',
		}),

	completed: z.boolean().optional(),

	topLayerTasks: z.boolean().optional(),

	taskId: z.string().optional(),

	folderId: z.string().uuid().nullable().optional(),
})

export const taskBaseSchema = z.object({
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

const taskFormSchema = taskBaseSchema.omit({
	completed: true,
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>

export const taskDtoSchema: z.ZodSchema = taskBaseSchema.extend({
	id: z.string(),
	userId: z.string(),
	createdAt: z.date(),
	subtasks: z.array(z.lazy((): z.ZodSchema => taskDtoSchema)),
})

const TasksValidation = {
	getTasksRequestSchema,
	taskBaseSchema,
	taskFormSchema,
	taskDtoSchema,
}

export default TasksValidation
