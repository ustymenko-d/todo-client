import { TaskDto } from '@/dto/tasks'

interface TaskEditorSettings {
	open: boolean
	mode: 'create' | 'edit'
	selectedTask: TaskDto | null
}

export interface TaskSlice {
	taskEditorSettings: TaskEditorSettings
	openTaskEditor: (
		mode: 'edit' | 'create',
		selectedTask: TaskDto | null
	) => void
	closeTaskEditor: () => void

	searchTerm: string
	setSearchTerm: (newValue: string) => void
}

const defaultTaskEditorSettings: TaskEditorSettings = {
	open: false,
	mode: 'create',
	selectedTask: null,
}

const createTaskSlice = (
	set: (partial: Partial<TaskSlice>) => void
): TaskSlice => ({
	taskEditorSettings: defaultTaskEditorSettings,
	openTaskEditor: (mode, selectedTask) =>
		set({ taskEditorSettings: { open: true, mode, selectedTask } }),
	closeTaskEditor: () => set({ taskEditorSettings: defaultTaskEditorSettings }),

	searchTerm: '',
	setSearchTerm: (searchTerm) => set({ searchTerm }),
})

export default createTaskSlice
