import { create } from 'zustand'
import createTaskSlice, { TaskSlice } from './slices/task'
import createAuthSlice, { AuthSlice } from './slices/auth'
import createFolderSlice, { FolderSlice } from './slices/folder'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import getStorage from '@/utils/getStorage'

interface AppStore extends TaskSlice, AuthSlice, FolderSlice {}

export const useAppStore = create<AppStore>()(
	devtools(
		persist(
			(set) => ({
				...createAuthSlice(set),
				...createTaskSlice(set),
				...createFolderSlice(set),
			}),
			{
				name: 'app-store',
				storage: createJSONStorage(getStorage),
			}
		)
	)
)

export default useAppStore
