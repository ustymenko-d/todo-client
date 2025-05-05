import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'
import { IEditorSettings } from '@/types/common'
import { TTask } from '@/types/tasks'

export interface TaskSlice {
	taskDialogSettings: {
		open: boolean
		task: TTask | null
	}
	updateDialogTask: (task: TTask) => void
	openTaskDialog: (task: TTask | null) => void
	closeTaskDialog: () => void

	taskEditorSettings: IEditorSettings<TTask>
	openTaskEditor: (mode: 'edit' | 'create', target: TTask | null) => void
	closeTaskEditor: () => void

	searchTerm: string
	setSearchTerm: (newValue: string) => void
}

const taskEditorSettings = getDefaultEditorSettings<TTask>()

const createTaskSlice = (
	set: (
		partial: Partial<TaskSlice> | ((state: TaskSlice) => Partial<TaskSlice>)
	) => void
): TaskSlice => ({
	taskDialogSettings: { open: false, task: null },
	updateDialogTask: (task) =>
		set((state) => ({
			taskDialogSettings: {
				...state.taskDialogSettings,
				task: task,
			},
		})),
	openTaskDialog: (task) => set({ taskDialogSettings: { open: true, task } }),
	closeTaskDialog: () =>
		set({ taskDialogSettings: { open: false, task: null } }),

	taskEditorSettings,
	openTaskEditor: (mode, target) =>
		set({ taskEditorSettings: { open: true, mode, target } }),
	closeTaskEditor: () =>
		set((state) => ({
			taskEditorSettings: {
				...state.taskEditorSettings,
				open: false,
				target: null,
			},
		})),

	searchTerm: '',
	setSearchTerm: (searchTerm) => set({ searchTerm }),
})

export default createTaskSlice
