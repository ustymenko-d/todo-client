import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'
import { IEditorSettings } from '@/types/common'
import { TTask } from '@/types/tasks'

export interface TaskSlice {
	taskEditorSettings: IEditorSettings<TTask>
	openTaskEditor: (mode: 'edit' | 'create', target: TTask | null) => void
	closeTaskEditor: () => void

	searchTerm: string
	setSearchTerm: (newValue: string) => void
}

const taskEditorSettings = getDefaultEditorSettings<TTask>()

const createTaskSlice = (
	set: (partial: Partial<TaskSlice>) => void
): TaskSlice => ({
	taskEditorSettings,
	openTaskEditor: (mode, target) =>
		set({ taskEditorSettings: { open: true, mode, target } }),
	closeTaskEditor: () => set({ taskEditorSettings }),

	searchTerm: '',
	setSearchTerm: (searchTerm) => set({ searchTerm }),
})

export default createTaskSlice
