import { z } from 'zod'

const validateDates = (data: {
	startDate?: Date | null
	expiresDate?: Date | null
}) => {
	if (!data.startDate || !data.expiresDate) return true
	return data.expiresDate >= data.startDate
}

const expiresAfterStartRefine = {
	message: 'The expires date must be the same as or later than start date',
	path: ['expiresDate'],
}

const getTasksRequest = z.object({
	page: z
		.number()
		.int({ message: 'Must be an integer.' })
		.min(1, { message: 'Must be at least 1.' }),

	limit: z
		.number()
		.int({ message: 'Must be an integer.' })
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

const taskBaseSchema = z.object({
	title: z.string().trim().nonempty({ message: 'Title is required.' }).max(50),

	description: z.string().trim().max(300).nullable().optional(),

	completed: z.boolean().optional(),

	parentTaskId: z.string().uuid().nullable().optional(),

	startDate: z
		.date()
		.nullable()
		.optional()
		.refine((date) => !date || date > new Date(), {
			message: 'Start date must be in the future.',
		}),

	expiresDate: z
		.date()
		.nullable()
		.optional()
		.refine((date) => !date || date > new Date(), {
			message: 'Expiration date must be in the future.',
		}),

	folderId: z.string().uuid().nullable().optional(),
})

const taskBase = taskBaseSchema.refine(validateDates, expiresAfterStartRefine)

const task = taskBaseSchema
	.extend({
		id: z.string(),
		userId: z.string(),
	})
	.refine(validateDates, expiresAfterStartRefine)

const TasksValidation = {
	getTasksRequest,
	taskBase,
	task,
}

export default TasksValidation
