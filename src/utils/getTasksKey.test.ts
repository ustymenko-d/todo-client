import { TASK_FETCH_LIMIT } from '@/const'

import getTasksKey from './getTasksKey'

jest.mock('@/const', () => ({
	TASK_FETCH_LIMIT: 25,
}))

describe('getTasksKey', () => {
	it('should return the correct key structure', () => {
		const folderId = 'folder-123'
		const result = getTasksKey(folderId)

		expect(result).toEqual(['tasks', { folderId: 'folder-123', limit: 25 }])
	})

	it('should include the correct TASK_FETCH_LIMIT from constants', () => {
		const result = getTasksKey('any-folder')

		expect(result[1]).toHaveProperty('limit', TASK_FETCH_LIMIT)
	})
})
