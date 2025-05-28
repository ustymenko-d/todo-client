import { TTask } from '@/types/tasks'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'

import createTaskSlice from './task'

jest.mock('@/utils/getDefaultEditorSettings')

describe('TaskSlice', () => {
	let mockSet: jest.Mock
	let taskSlice: ReturnType<typeof createTaskSlice>
	let task: TTask

	beforeEach(() => {
		mockSet = jest.fn()
		taskSlice = createTaskSlice(mockSet)

		task = {
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
		}
	})

	it('should initialize taskEditorSettings with default values', () => {
		const defaultEditorSettings = getDefaultEditorSettings<TTask>()
		expect(taskSlice.taskEditorSettings).toEqual(defaultEditorSettings)
	})

	it('should open task editor with correct settings', () => {
		const mode = 'edit'
		taskSlice.openTaskEditor(mode, task)

		expect(mockSet).toHaveBeenCalledWith({
			taskEditorSettings: { open: true, mode, target: task },
		})
	})

	it('should close task editor and reset target', () => {
		const mode = 'edit'
		taskSlice.openTaskEditor(mode, task)
		taskSlice.closeTaskEditor()

		expect(mockSet).toHaveBeenCalledTimes(2)

		const setFn = mockSet.mock.calls[1][0]
		const prevState = {
			taskEditorSettings: {
				open: true,
				mode,
				target: task,
			},
		}

		expect(setFn(prevState)).toEqual({
			taskEditorSettings: {
				open: false,
				mode,
				target: null,
			},
		})
	})

	it('should open task dialog with correct task', () => {
		taskSlice.openTaskDialog(task)

		expect(mockSet).toHaveBeenCalledWith({
			taskDialogSettings: { open: true, task },
		})
	})

	it('should close task dialog and reset task', () => {
		taskSlice.closeTaskDialog()

		expect(mockSet).toHaveBeenCalledWith({
			taskDialogSettings: { open: false, task: null },
		})
	})

	it('should update task in task dialog settings', () => {
		taskSlice.updateDialogTask(task)

		expect(mockSet).toHaveBeenCalledTimes(1)

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

	it('should set search term correctly', () => {
		const searchTerm = 'test'

		taskSlice.setSearchTerm(searchTerm)

		expect(mockSet).toHaveBeenCalledWith({
			searchTerm,
		})
	})
})
