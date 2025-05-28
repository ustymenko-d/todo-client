import { IEditorSettings } from '@/types/common'
import { IFolder } from '@/types/folders'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'

export interface FoldersSlice {
	folderEditorSettings: IEditorSettings<IFolder>

	openFolderEditor: (
		mode: 'edit' | 'create',
		selectedFolder: IFolder | null
	) => void

	closeFolderEditor: () => void
}

const folderEditorSettings = getDefaultEditorSettings<IFolder>()

const createFoldersSlice = (
	set: (
		partial:
			| Partial<FoldersSlice>
			| ((state: FoldersSlice) => Partial<FoldersSlice>)
	) => void
): FoldersSlice => ({
	folderEditorSettings,

	openFolderEditor: (mode, target) =>
		set({ folderEditorSettings: { open: true, mode, target } }),

	closeFolderEditor: () =>
		set((state) => ({
			folderEditorSettings: {
				...state.folderEditorSettings,
				open: false,
				target: null,
			},
		})),
})

export default createFoldersSlice
