import createFoldersSlice from './folders'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'
import { IFolder, IFolderWithTasks } from '@/types/folders'
import { TTask } from '@/types/tasks'

jest.mock('@/utils/getDefaultEditorSettings')

const mockTask: TTask = {
	id: 'task-1',
	title: 'Test Task',
	userId: 'user-1',
	completed: false,
	folderId: '1',
	description: '',
	parentTaskId: null,
	startDate: new Date(),
	expiresDate: new Date(),
	lastEdited: new Date().toISOString(),
	subtasks: [],
}

const mockFolder: IFolder = {
	id: '1',
	name: 'Work',
	userId: 'user-1',
}

const mockFoldersWithTasks: IFolderWithTasks[] = [
	{
		id: '1',
		name: 'Work',
		page: 1,
		limit: 10,
		pages: 1,
		total: 1,
		tasks: [mockTask],
	},
]

describe('FoldersSlice', () => {
	let mockSet: jest.Mock
	let foldersSlice: ReturnType<typeof createFoldersSlice>

	beforeEach(() => {
		mockSet = jest.fn()
		foldersSlice = createFoldersSlice(mockSet)
	})

	it('should initialize folderEditorSettings with default values', () => {
		const defaultSettings = getDefaultEditorSettings<IFolder>()
		expect(foldersSlice.folderEditorSettings).toEqual(defaultSettings)
	})

	it('should set foldersWithTasks directly', () => {
		foldersSlice.setFoldersWithTasks(mockFoldersWithTasks)

		const setFn = mockSet.mock.calls[0][0]
		expect(setFn({ foldersWithTasks: [] })).toEqual({
			foldersWithTasks: mockFoldersWithTasks,
		})
	})

	it('should set foldersWithTasks using a function', () => {
		foldersSlice.setFoldersWithTasks((prev) => [
			...prev,
			...mockFoldersWithTasks,
		])

		const setFn = mockSet.mock.calls[0][0]
		expect(setFn({ foldersWithTasks: [] })).toEqual({
			foldersWithTasks: mockFoldersWithTasks,
		})
	})

	it('should open folder editor with correct mode and target', () => {
		foldersSlice.openFolderEditor('edit', mockFolder)

		expect(mockSet).toHaveBeenCalledWith({
			folderEditorSettings: {
				open: true,
				mode: 'edit',
				target: mockFolder,
			},
		})
	})

	it('should close folder editor and reset target', () => {
		const currentState = {
			folderEditorSettings: {
				open: true,
				mode: 'edit',
				target: mockFolder,
			},
		}

		foldersSlice.closeFolderEditor()

		const setFn = mockSet.mock.calls[0][0]
		expect(setFn(currentState)).toEqual({
			folderEditorSettings: {
				open: false,
				mode: 'edit',
				target: null,
			},
		})
	})
})
