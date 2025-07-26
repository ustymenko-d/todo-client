import createTableSlice, { TableSlice } from './table'

describe('TableSlice', () => {
	let mockSet: jest.Mock
	let tableSlice: ReturnType<typeof createTableSlice>
	const columnId = 'col1'

	beforeEach(() => {
		mockSet = jest.fn()
		tableSlice = createTableSlice(mockSet)
	})

	it('initializes visibleColumns as an empty object', () => {
		expect(tableSlice.visibleColumns).toEqual({})
	})

	describe('toggleColumnVisibility', () => {
		const getNextVisible = (initial: Partial<Record<string, boolean>>): Record<string, boolean> => {
			tableSlice.toggleColumnVisibility(columnId)

			const reducer = mockSet.mock.calls[0][0] as (state: TableSlice) => Partial<TableSlice>

			const prevState = {
				visibleColumns: initial as Record<string, boolean>,
			} as TableSlice

			return reducer(prevState).visibleColumns!
		}

		test.each`
			initialValue | expectedValue
			${undefined} | ${false}
			${false}     | ${true}
			${true}      | ${false}
		`(
			'toggles "$columnId" from $initialValue to $expectedValue',
			({ initialValue, expectedValue }) => {
				const initial = initialValue === undefined ? {} : { [columnId]: initialValue }

				expect(getNextVisible(initial)).toEqual({ [columnId]: expectedValue })
			}
		)
	})

	it('replaces visibleColumns with the provided object', () => {
		const columns = { col1: true, col2: false }
		tableSlice.setVisibleColumns(columns)
		expect(mockSet).toHaveBeenCalledWith({ visibleColumns: columns })
	})
})
