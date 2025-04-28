import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAppStore from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FoldersService from '@/services/folders.service'
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
import { IFolder, TFolderName } from '@/types/folders'

const Form = () => {
	const router = useRouter()
	const mode = useAppStore((state) => state.folderEditorSettings.mode)
	const selectedFolder = useAppStore(
		(state) => state.folderEditorSettings.target
	)
	const accountInfo = useAppStore((state) => state.accountInfo)
	const setAccountInfo = useAppStore((state) => state.setAccountInfo)
	const closeEditor = useAppStore((state) => state.closeFolderEditor)

	const [status, setStatus] = useState<TResponseState>('default')
	const isEditing = mode === 'edit'

	const defaultValues = useMemo<TFolderName>(
		() => ({
			name: isEditing ? selectedFolder?.name || '' : '',
		}),
		[isEditing, selectedFolder?.name]
	)
	const folderForm = useForm<TFolderName>({
		resolver: zodResolver(FoldersValidation.folderName),
		defaultValues,
	})

	const updateFoldersList = (folder: IFolder) => {
		if (accountInfo) {
			setAccountInfo((prev) => ({
				...prev!,
				folders: [folder, ...(prev?.folders ?? [])],
			}))
		}
	}

	const updateFolderName = (newName: string) => {
		if (!selectedFolder || !accountInfo?.folders) return

		if (accountInfo) {
			setAccountInfo((prev) => ({
				...prev!,
				folders: (prev?.folders ?? []).map((folder) =>
					folder.id === selectedFolder.id
						? { ...folder, name: newName }
						: folder
				),
			}))
		}
	}

	const handleAction = async (values: TFolderName) => {
		try {
			setStatus('pending')
			const targetId = selectedFolder?.id ?? ''

			const action = isEditing
				? FoldersService.renameFolder(targetId, values)
				: FoldersService.createFolder(values)

			const res = await action
			console.log(res)

			if (!res.data.success) {
				toast.error('Failed to process folder')
				setStatus('error')
				return
			}

			toast.success(isEditing ? 'Folder renamed' : 'Folder created')
			folderForm.reset()
			closeEditor()
			setStatus('success')
			if (isEditing) {
				updateFolderName(values.name)
			} else {
				updateFoldersList(res.data.folder)
			}
			router.refresh()
		} catch (error) {
			setStatus('error')
			toast.error('Something went wrong!')
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
