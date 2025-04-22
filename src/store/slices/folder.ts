import { IFolder } from '@/types/folder'

export interface FolderSlice {
	folders: IFolder[] | null
	setFolders: (folders: IFolder[]) => void
	resetFolders: () => void
}

const createFolderSlice = (
	set: (partial: Partial<FolderSlice>) => void
): FolderSlice => ({
	folders: null,
	setFolders: (folders) => set({ folders }),
	resetFolders: () => set({ folders: null }),
})

export default createFolderSlice
