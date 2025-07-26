'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import FoldersAPI from '@/api/folders.api'
import useAppStore from '@/store/store'
import { TResponseState } from '@/types/common'
import { IFolder, TFolderName, TFoldersAction } from '@/types/folders'

import { useWithRecaptcha } from '../useWithRecaptcha'

const useActions = (action: TFoldersAction, folder?: IFolder) => {
	const queryClient = useQueryClient()
	const { withRecaptcha } = useWithRecaptcha('folder_action')

	const closeEditor = useAppStore(s => s.closeFolderEditor)

	const performAction = async (payload?: TFolderName | string) => {
		switch (action) {
			case 'create':
				return FoldersAPI.createFolder(await withRecaptcha<TFolderName>(payload as TFolderName))

			case 'rename':
				if (!folder) throw new Error('`folder` is required to rename')
				return FoldersAPI.renameFolder(folder?.id, payload as TFolderName)

			case 'delete':
				if (!folder) throw new Error('`folder` is required to delete')
				return FoldersAPI.deleteFolder(folder?.id)

			default:
				throw new Error('Unknown action')
		}
	}

	const handleFolderAction = async (
		setLoadingState: (state: TResponseState) => void,
		payload?: TFolderName
	) => {
		try {
			setLoadingState('pending')

			const { success, message } = await performAction(payload)

			if (!success) {
				setLoadingState('error')
				toast.error(message ?? 'Something went wrong')
				throw new Error(`[useFoldersActions] ${action} failed`)
			}

			setLoadingState('success')
			toast.success('Successfuly completed')

			queryClient.invalidateQueries({ queryKey: ['folders'] })

			if (['create', 'rename'].includes(action)) closeEditor()
		} catch (error) {
			console.error(`[useFoldersActions] ${action} folder error:`, error)
			throw error
		}
	}

	return { handleFolderAction }
}

export default useActions
