import { useState } from 'react'
import useAppStore from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FoldersService from '@/services/folders.service'
import useUpdate from '@/hooks/folders/useUpdate'
import { toast } from 'sonner'
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
import { TResponseState } from '@/types/common'
import { TFolderName } from '@/types/folders'

const Form = () => {
	const mode = useAppStore((state) => state.folderEditorSettings.mode)
	const selectedFolder = useAppStore(
		(state) => state.folderEditorSettings.target
	)
	const closeEditor = useAppStore((state) => state.closeFolderEditor)
	const [status, setStatus] = useState<TResponseState>('default')
	const isEditing = mode === 'edit'

	const { handleUpdateFolders } = useUpdate()

	const folderForm = useForm<TFolderName>({
		resolver: zodResolver(FoldersValidation.folderName),
		defaultValues: {
			name: isEditing ? selectedFolder?.name : '',
		},
	})

	const handleAction = async (values: TFolderName) => {
		try {
			setStatus('pending')
			const targetId = selectedFolder?.id ?? ''

			const action = isEditing
				? FoldersService.renameFolder(targetId, values)
				: FoldersService.createFolder(values)

			const { data } = await action

			if (!data.success) {
				toast.error(data.message || 'Failed to process folder')
				setStatus('error')
				return
			}

			toast.success(isEditing ? 'Folder renamed' : 'Folder created')
			setStatus('success')

			handleUpdateFolders(isEditing ? 'rename' : 'create', data.folder)
			folderForm.reset()
			closeEditor()
		} catch (error) {
			console.error(`Error while creating a task: ${error}`)
			toast.error('Something went wrong!')
			setStatus('error')
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
