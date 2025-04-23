import { IEditorSettings } from '@/types/common'
import { IFolder } from '@/types/folder'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'

export interface FoldersSlice {
	folders: IFolder[] | null
	setFolders: (folders: IFolder[]) => void
	resetFolders: () => void

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
	folders: null,
	setFolders: (folders) => set({ folders }),
	resetFolders: () => set({ folders: null }),

	isOpenFoldersDialog: false,
	setIsOpenFoldersDialog: (isOpenFoldersDialog) => set({ isOpenFoldersDialog }),

	folderEditorSettings,
	openFolderEditor: (mode, target) =>
		set({ folderEditorSettings: { open: true, mode, target } }),
	closeFolderEditor: () => set({ folderEditorSettings }),
})

export default createFoldersSlice
