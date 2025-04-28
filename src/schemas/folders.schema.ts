import { z } from 'zod'

const folderName = z.object({
	name: z
		.string()
		.nonempty()
		.max(25, { message: 'The folder name must not exceed 20 characters' })
		.regex(/^[a-zA-Z0-9 ]*$/, {
			message:
				'The folder name must contain at least one letter (a-z or A-Z) or digits. Cyrillic characters are not allowed.',
		}),
})

const FoldersValidation = {
	folderName,
}

export default FoldersValidation
