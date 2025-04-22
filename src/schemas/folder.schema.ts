import { z } from 'zod'

export const FolderNameSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'The folder name is required.' })
		.min(2, { message: 'The folder name must be at least 2 characters long.' })
		.max(20, { message: 'The folder name must not exceed 20 characters' })
		.regex(/(?=.*[a-z])|(?=.*[A-Z])/, {
			message:
				'The folder name must contain at least one lowercase or one uppercase letter.',
		}),
})
