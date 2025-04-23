import { IEditorSettings } from '@/types/common'

const getDefaultEditorSettings = <T>(): IEditorSettings<T> => ({
	open: false,
	mode: 'create',
	target: null,
})

export default getDefaultEditorSettings
