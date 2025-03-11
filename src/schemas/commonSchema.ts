import { z } from 'zod'

export const paginationSchema = z.object({
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
})
