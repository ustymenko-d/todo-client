export interface TableSlice {
	visibleColumns: Record<string, boolean>
	toggleColumnVisibility: (columnId: string) => void
	setVisibleColumns: (columns: Record<string, boolean>) => void
}

const createTableSlice = (
	set: (
		partial: Partial<TableSlice> | ((state: TableSlice) => Partial<TableSlice>)
	) => void
): TableSlice => ({
	visibleColumns: {},

	toggleColumnVisibility: (columnId) => {
		set((state) => ({
			visibleColumns: {
				...state.visibleColumns,
				[columnId]: !(state.visibleColumns[columnId] ?? true),
			},
		}))
	},

	setVisibleColumns: (columns) => {
		set({ visibleColumns: columns })
	},
})

export default createTableSlice
