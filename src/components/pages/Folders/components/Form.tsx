'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
	Form as RHForm,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import LoadingButton from '@/components/ui/LoadingButton'
import useActions from '@/hooks/folders/useActions'
import FoldersValidation from '@/schemas/folders.schema'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { TFolderName } from '@/types/folders'

const Form = () => {
	const mode = useAppStore(s => s.folderEditorSettings.mode)
	const target = useAppStore(s => s.folderEditorSettings.target)

	const [status, setStatus] = useState<TResponseState>('default')

	const isEditing = mode === 'edit'

	const { handleFolderAction: createFolder } = useActions('create')
	const { handleFolderAction: renameFolder } = useActions('rename', target ?? undefined)

	const folderForm = useForm<TFolderName>({
		resolver: zodResolver(FoldersValidation.folderName),
		defaultValues: {
			name: isEditing ? target?.name : '',
		},
	})

	const handleSubmit = (values: TFolderName) =>
		mode === 'create' ? createFolder(setStatus, values) : renameFolder(setStatus, values)

	return (
		<RHForm {...folderForm}>
			<form onSubmit={folderForm.handleSubmit(handleSubmit)}>
				<div className='flex flex-col gap-4'>
					<FormField
						control={folderForm.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-muted-foreground'>Folder name:</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Folder name'
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<LoadingButton
						loading={status === 'pending'}
						disabled={status === 'success'}
						type='submit'>
						<span>{isEditing ? 'Rename' : 'Create'}</span>
					</LoadingButton>
				</div>
			</form>
		</RHForm>
	)
}

export default Form
