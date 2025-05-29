import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import getStorage from '@/utils/getStorage'

import createAuthSlice, { AuthSlice } from './slices/auth'
import createFoldersSlice, { FoldersSlice } from './slices/folders'
import createTaskSlice, { TaskSlice } from './slices/task'

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
					isAuthorized: state.isAuthorized,
				}),
			}
		)
	)
)

export default useAppStore
