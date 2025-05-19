import { IEditorSettings } from '@/types/common'
import { IFolder, IFolderWithTasks } from '@/types/folders'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'

export interface FoldersSlice {
	foldersHydrated: boolean
	setFoldersHydrated: (newValue: boolean) => void

	foldersWithTasks: IFolderWithTasks[]
	setFoldersWithTasks: (
		value:
			| IFolderWithTasks[]
			| ((prev: IFolderWithTasks[]) => IFolderWithTasks[])
	) => void

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
	foldersHydrated: false,
	setFoldersHydrated: (foldersHydrated) => set({ foldersHydrated }),

	foldersWithTasks: [],
	setFoldersWithTasks: (value) =>
		set((state) => ({
			foldersWithTasks:
				typeof value === 'function' ? value(state.foldersWithTasks) : value,
		})),

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
