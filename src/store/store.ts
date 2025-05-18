import { create } from 'zustand'
import createTaskSlice, { TaskSlice } from './slices/task'
import createAuthSlice, { AuthSlice } from './slices/auth'
import createFoldersSlice, { FoldersSlice } from './slices/folders'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import getStorage from '@/utils/getStorage'

interface AppStore extends TaskSlice, AuthSlice, FoldersSlice {}

export const useAppStore = create<AppStore>()(
	devtools(
		persist(
			(set) => ({
				...createAuthSlice(set),
				...createTaskSlice(set),
				...createFoldersSlice(set),
			}),
			{
				name: 'app-store',
				storage: createJSONStorage(getStorage),
				partialize: (state) => ({
					authHydrated: state.authHydrated,
					accountInfo: state.accountInfo,
					foldersWithTasks: state.foldersWithTasks,
				}),
			}
		)
	)
)

export default useAppStore
