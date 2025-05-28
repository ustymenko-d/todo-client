import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import createAuthSlice, { AuthSlice } from './slices/auth'
import createFoldersSlice, { FoldersSlice } from './slices/folders'
import createTaskSlice, { TaskSlice } from './slices/task'

interface AppStore extends TaskSlice, AuthSlice, FoldersSlice {}

export const useAppStore = create<AppStore>()(
	devtools((set) => ({
		...createAuthSlice(set),
		...createTaskSlice(set),
		...createFoldersSlice(set),
	}))
)

export default useAppStore
