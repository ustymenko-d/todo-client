import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import getStorage from '@/utils/getStorage'

import createAuthSlice, { AuthSlice } from './slices/auth'
import createFoldersSlice, { FoldersSlice } from './slices/folders'
import createTableSlice, { TableSlice } from './slices/table'
import createTaskSlice, { TaskSlice } from './slices/task'

interface AppStore extends TaskSlice, AuthSlice, FoldersSlice, TableSlice {}

export const useAppStore = create<AppStore>()(
	devtools(
		persist(
			(set) => ({
				...createAuthSlice(set),
				...createTaskSlice(set),
				...createFoldersSlice(set),
				...createTableSlice(set),
			}),
			{
				name: 'app-store',
				storage: createJSONStorage(getStorage),
				partialize: (state) => ({
					isAuthorized: state.isAuthorized,
					visibleColumns: state.visibleColumns,
				}),
			}
		)
	)
)

export default useAppStore
