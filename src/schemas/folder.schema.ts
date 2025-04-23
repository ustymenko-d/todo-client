import { z } from 'zod'

const folderName = z.object({
	name: z
		.string()
		.nonempty({ message: 'The folder name is required.' })
		.min(2, { message: 'The folder name must be at least 2 characters long.' })
		.max(20, { message: 'The folder name must not exceed 20 characters' })
		.regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/, {
			message:
				'The folder name must contain at least one letter (a-z or A-Z) or digits. Cyrillic characters are not allowed.',
		}),
})

const FolderValidation = {
	folderName,
}

export default FolderValidation
