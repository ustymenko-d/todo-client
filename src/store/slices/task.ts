import { TaskDto } from '@/dto/tasks'

interface TaskEditorSettings {
	open: boolean
	mode: 'create' | 'edit'
	selectedTask: TaskDto | null
}

export interface TaskSlice {
	taskEditorSettings: TaskEditorSettings
	setTaskEditorSettings: (newValue: TaskEditorSettings) => void
	closeTaskEditor: () => void
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
	setTaskEditorSettings: (taskEditorSettings) => set({ taskEditorSettings }),
	closeTaskEditor: () => set({ taskEditorSettings: defaultTaskEditorSettings }),
})

export default createTaskSlice
