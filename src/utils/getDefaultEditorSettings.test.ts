import getDefaultEditorSettings from './getDefaultEditorSettings'

describe('getDefaultEditorSettings', () => {
	it('should return default editor settings', () => {
		const result = getDefaultEditorSettings()

		expect(result).toHaveProperty('open', false)
		expect(result).toHaveProperty('open', false)
		expect(result).toHaveProperty('mode', 'create')
	})
})
