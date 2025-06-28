'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import FoldersAPI from '@/api/folders.api'
import { queryClient } from '@/components/providers/Query.provider'
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
import FoldersValidation from '@/schemas/folders.schema'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { TFolderName } from '@/types/folders'

const Form = () => {
	const { mode, target } = useAppStore((s) => s.folderEditorSettings)
	const closeEditor = useAppStore((s) => s.closeFolderEditor)

	const [status, setStatus] = useState<TResponseState>('default')

	const isEditing = mode === 'edit'

	const folderForm = useForm<TFolderName>({
		resolver: zodResolver(FoldersValidation.folderName),
		defaultValues: {
			name: isEditing ? target?.name : '',
		},
	})

	const handleAction = async (values: TFolderName) => {
		setStatus('pending')

		try {
			const targetId = target?.id ?? ''

			const action = isEditing
				? FoldersAPI.renameFolder(targetId, values)
				: FoldersAPI.createFolder(values)

			const { success, message } = await action

			if (!success)
				throw new Error(
					message || isEditing ? 'Folder rename failed' : 'Folder create failed'
				)

			setStatus('success')
			toast.success(isEditing ? 'Folder renamed' : 'Folder created')
			folderForm.reset()
			queryClient.invalidateQueries({
				queryKey: ['folders'],
			})
			closeEditor()
		} catch (error) {
			setStatus('error')
			console.error(`Error while creating a task: ${error}`)
		}
	}

	return (
		<RHForm {...folderForm}>
			<form onSubmit={folderForm.handleSubmit(handleAction)}>
				<div className='flex flex-col gap-4'>
					<FormField
						control={folderForm.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-muted-foreground'>
									Folder name:
								</FormLabel>
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
