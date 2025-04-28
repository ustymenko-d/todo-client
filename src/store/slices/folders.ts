import { IEditorSettings } from '@/types/common'
import { IFolder } from '@/types/folders'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'

export interface FoldersSlice {
	isOpenFoldersDialog: boolean
	setIsOpenFoldersDialog: (newValue: boolean) => void

	folderEditorSettings: IEditorSettings<IFolder>
	openFolderEditor: (
		mode: 'edit' | 'create',
		selectedFolder: IFolder | null
	) => void
	closeFolderEditor: () => void
}

const folderEditorSettings = getDefaultEditorSettings<IFolder>()

const createFoldersSlice = (
	set: (partial: Partial<FoldersSlice>) => void
): FoldersSlice => ({
	isOpenFoldersDialog: false,
	setIsOpenFoldersDialog: (isOpenFoldersDialog) => set({ isOpenFoldersDialog }),

	folderEditorSettings,
	openFolderEditor: (mode, target) =>
		set({ folderEditorSettings: { open: true, mode, target } }),
	closeFolderEditor: () => set({ folderEditorSettings }),
})

export default createFoldersSlice
