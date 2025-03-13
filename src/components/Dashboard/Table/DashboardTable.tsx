import TasksService from '@/services/api/tasks'
import DataTable from './components/DataTable'
import columns from './components/Columns'
import { FC } from 'react'

interface DashboardTableProps {
	page: string
	limit: string
}

const DashboardTable: FC<DashboardTableProps> = async ({ page, limit }) => {
	const response = await TasksService.getTasks({
		limit: limit ? Number(limit) : 5,
		page: page ? Number(page) : 1,
		topLayerTasks: true,
	})
	const { tasks, pages } = response.tasksData
	const pagination = {
		initialLimit: limit ? Number(limit) : 5,
		initialPage: page ? Number(page) : 1,
		pages,
	}

	return (
		<div className='container mx-auto'>
			<DataTable
				columns={columns}
				data={tasks}
				pagination={pagination}
			/>
		</div>
	)
}

export default DashboardTable
