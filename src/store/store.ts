import { create } from 'zustand'
import createTaskSlice, { TaskSlice } from './slices/task'
import createAuthSlice, { AuthSlice } from './slices/auth'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import getStorage from '@/utils/getStorage'

interface AppStore extends TaskSlice, AuthSlice {}

export const useAppStore = create<AppStore>()(
	devtools(
		persist(
			(set, get) => ({
				...createAuthSlice(set, get),
				...createTaskSlice(set),
			}),
			{
				name: 'app-store',
				storage: createJSONStorage(getStorage),
			}
		)
	)
)

export default useAppStore
