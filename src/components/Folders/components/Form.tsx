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
import FolderValidation, { TFolderName } from '@/schemas/folder.schema'
import FolderService from '@/services/Axios/folder.service'
import useAppStore from '@/store/store'
import { TResponseStatus } from '@/types/common'
import { IFolder } from '@/types/folder'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Form = () => {
	const router = useRouter()
	const mode = useAppStore((state) => state.folderEditorSettings.mode)
	const selectedFolder = useAppStore(
		(state) => state.folderEditorSettings.target
	)
	const folders = useAppStore((state) => state.folders)
	const closeEditor = useAppStore((state) => state.closeFolderEditor)
	const isEditing = mode === 'edit'
	const setFolders = useAppStore((state) => state.setFolders)
	const [status, setStatus] = useState<TResponseStatus>('default')
	const defaultValues = useMemo<TFolderName>(
		() => ({
			name: isEditing ? selectedFolder?.name || '' : '',
		}),
		[isEditing, selectedFolder?.name]
	)
	const folderForm = useForm<TFolderName>({
		resolver: zodResolver(FolderValidation.folderName),
		defaultValues,
	})

	const handleTaskAction = async (values: TFolderName) => {
		try {
			setStatus('pending')
			const targetId = selectedFolder ? selectedFolder?.id : ''

			const { data } =
				mode === 'create'
					? await FolderService.createFolder(values)
					: await FolderService.renameFolder(targetId, values)

			const { success } = data
			if (success) {
				setStatus('success')
				toast.success(
					mode === 'create'
						? 'Folder successfully created'
						: 'Folder successfully renamed'
				)
				folderForm.reset()
				closeEditor()

				if (mode === 'create') {
					const { data, status } = await FolderService.getFolders({
						page: 1,
						limit: 25,
					})

					if (status === 200) {
						setFolders(data.folders)
					}
				}
				if (mode === 'edit' && selectedFolder && folders) {
					setFolders(
						folders.map((folder: IFolder) =>
							folder.id === selectedFolder.id
								? { ...folder, name: values.name }
								: folder
						)
					)
				}
				router.refresh()
			} else {
				toast.error('Failed to process folder')
			}
		} catch (error) {
			setStatus('error')
			toast.error('Something went wrong!')
			console.error(`Error while creating a task: ${error}`)
		}
	}

	return (
		<RHForm {...folderForm}>
			<form onSubmit={folderForm.handleSubmit(handleTaskAction)}>
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
						<span>{mode === 'create' ? 'Create' : 'Rename'}</span>
					</LoadingButton>
				</div>
			</form>
		</RHForm>
	)
}

export default Form
