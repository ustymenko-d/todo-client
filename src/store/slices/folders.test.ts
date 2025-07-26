import { IFolder } from '@/types/folders'
import getDefaultEditorSettings from '@/utils/getDefaultEditorSettings'

import createFoldersSlice, { FoldersSlice } from './folders'

jest.mock('@/utils/getDefaultEditorSettings')

describe('FoldersSlice', () => {
	let mockSet: jest.Mock
	let slice: FoldersSlice
	const defaultEditorSettings = getDefaultEditorSettings<IFolder>()
	const getMockFolder = (): IFolder => ({ id: '1', name: 'Test Folder' } as IFolder)

	beforeEach(() => {
		mockSet = jest.fn()
		slice = createFoldersSlice(mockSet)
	})

	it('initializes folderEditorSettings with defaults', () => {
		expect(slice.folderEditorSettings).toEqual(defaultEditorSettings)
	})

	it('initializes isFetching as false', () => {
		expect(slice.isFetching).toBe(false)
	})

	describe('openFolderEditor', () => {
		it('calls set with open=true, mode and target', () => {
			const folder = getMockFolder()
			const mode: 'edit' | 'create' = 'edit'

			slice.openFolderEditor(mode, folder)

			expect(mockSet).toHaveBeenCalledWith({
				folderEditorSettings: { open: true, mode, target: folder },
			})
		})

		it('opening in create mode with null target', () => {
			slice.openFolderEditor('create', null)
			expect(mockSet).toHaveBeenCalledWith({
				folderEditorSettings: { open: true, mode: 'create', target: null },
			})
		})
	})

	it('produces a reducer that closes editor and clears target', () => {
		slice.closeFolderEditor()

		const reducer = mockSet.mock.calls[0][0] as (state: FoldersSlice) => Partial<FoldersSlice>

		const prevState = {
			folderEditorSettings: {
				open: true,
				mode: 'edit',
				target: getMockFolder(),
			},
		} as unknown as FoldersSlice

		const next = reducer(prevState)
		expect(next).toEqual({
			folderEditorSettings: {
				open: false,
				mode: 'edit',
				target: null,
			},
		})
	})

	describe('setIsFetching', () => {
		it.each([true, false])('sets isFetching to %s', value => {
			slice.setIsFetching(value)
			expect(mockSet).toHaveBeenCalledWith({ isFetching: value })
		})
	})
})
