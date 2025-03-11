import TasksService from '@/services/api/tasks'
import DataTable from './components/DataTable'
import columns from './components/Columns'

const DashboardTable = async () => {
	const tasksResponse = await TasksService.getTasks({
		limit: 20,
		page: 1,
		topLayerTasks: true,
	})
	const { tasks } = tasksResponse.tasksData
	console.log(tasks)

	return (
		<div className='container mx-auto py-10'>
			<DataTable
				columns={columns}
				data={tasks}
			/>
		</div>
	)
}

export default DashboardTable
