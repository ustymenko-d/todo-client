import { FC } from 'react'
import { redirect } from 'next/navigation'
import TasksService from '@/services/api/tasks'
import Header from '@/components/Dashboard/Header'
import TaskEditor from '@/components/TaskEditor/TaskEditor'
import DashboardTable from '@/components/Dashboard/DashboardTable/DashboardTable'

interface DashboardPageProps {
	searchParams: { page?: string; limit?: string }
}

const DashboardPage: FC<DashboardPageProps> = async ({ searchParams }) => {
	const { page, limit } = await searchParams

	if (!page || !limit) {
		redirect(`/dashboard?page=1&limit=5`)
	}

	const { tasksData } = await TasksService.getTasks({
		limit: +limit,
		page: +page,
		topLayerTasks: true,
	})
	const { tasks, pages } = tasksData
	const pagination = {
		page: page ? +page : 1,
		limit: limit ? +limit : 5,
		pages,
	}

	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<Header />

			<DashboardTable
				data={tasks}
				pagination={pagination}
			/>
			<TaskEditor />
		</section>
	)
}

export default DashboardPage
