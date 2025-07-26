import { TTask } from '@/types/tasks'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'

import createTaskSlice from './task'

jest.mock('@/utils/getDefaultEditorSettings')

describe('TaskSlice', () => {
	let mockSet: jest.Mock
	let taskSlice: ReturnType<typeof createTaskSlice>
	const defaultEditorSettings = getDefaultEditorSettings<TTask>()

	const getMockTask = (): TTask => ({
		id: '1',
		title: 'Test Task',
		userId: 'user-1',
		completed: false,
		folderId: null,
		description: 'Task description',
		parentTaskId: null,
		startDate: new Date(),
		expiresDate: new Date(),
		lastEdited: new Date().toISOString(),
		subtasks: [],
	})

	beforeEach(() => {
		mockSet = jest.fn()
		taskSlice = createTaskSlice(mockSet)
	})

	it('initializes taskEditorSettings with default values', () => {
		expect(taskSlice.taskEditorSettings).toEqual(defaultEditorSettings)
	})

	describe('taskInMotion block', () => {
		it('sets taskInMotion to a given task', () => {
			const task = getMockTask()

			taskSlice.setTaskInMotion(task)

			expect(mockSet).toHaveBeenCalledWith({ taskInMotion: task })
		})

		it('resets taskInMotion to null', () => {
			taskSlice.setTaskInMotion(null)

			expect(mockSet).toHaveBeenCalledWith({ taskInMotion: null })
		})
	})

	describe('taskDialogSettings block', () => {
		it('opens task dialog with correct task', () => {
			const task = getMockTask()
			taskSlice.openTaskDialog(task)

			expect(mockSet).toHaveBeenCalledWith({
				taskDialogSettings: { open: true, task },
			})
		})

		it('closes task dialog and resets task', () => {
			taskSlice.closeTaskDialog()

			expect(mockSet).toHaveBeenCalledWith({
				taskDialogSettings: { open: false, task: null },
			})
		})

		it('updates task in task dialog settings', () => {
			const task = getMockTask()
			taskSlice.updateDialogTask(task)

			const setFn = mockSet.mock.calls[0][0]
			const prevState = {
				taskDialogSettings: {
					open: true,
					task: null,
				},
			}

			expect(setFn(prevState)).toEqual({
				taskDialogSettings: {
					open: true,
					task,
				},
			})
		})
	})

	describe('taskEditorSettings block', () => {
		it('opens task editor with correct settings', () => {
			const task = getMockTask()
			const mode = 'edit'

			taskSlice.openTaskEditor(mode, task)

			expect(mockSet).toHaveBeenCalledWith({
				taskEditorSettings: { open: true, mode, target: task },
			})
		})

		it('closes task editor and resets target', () => {
			taskSlice.closeTaskEditor()

			const setFn = mockSet.mock.calls[0][0]
			const prevState = {
				taskEditorSettings: {
					open: true,
					mode: 'edit',
					target: getMockTask(),
				},
			}

			expect(setFn(prevState)).toEqual({
				taskEditorSettings: {
					open: false,
					mode: 'edit',
					target: null,
				},
			})
		})
	})

	it('sets search term correctly', () => {
		const searchTerm = 'test'

		taskSlice.setSearchTerm(searchTerm)

		expect(mockSet).toHaveBeenCalledWith({ searchTerm })
	})
})
