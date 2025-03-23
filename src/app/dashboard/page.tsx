import { FC } from 'react'
import { redirect } from 'next/navigation'
import TasksService from '@/services/api/tasks'
import Header from '@/components/Dashboard/Header'
import TaskEditor from '@/components/TaskEditor/TaskEditor'
import DashboardTable from '@/components/Dashboard/DashboardTable/DashboardTable'

interface DashboardPageProps {
	searchParams: {
		page?: string
		limit?: string
		title?: string
		topLayerTasks?: string
	}
}

const strToBool = (value?: string): boolean =>
	value?.trim().toLowerCase() === 'true' || false

const DashboardPage: FC<DashboardPageProps> = async ({ searchParams }) => {
	const {
		page = '1',
		limit = '2',
		title,
		topLayerTasks = 'true',
	} = await searchParams

	if (!page || !limit) {
		redirect(`/dashboard?page=1&limit=5&topLayerTasks=true`)
	}

	const pagination = {
		page: +page || 1,
		limit: +limit || 5,
	}

	const { tasksData } = await TasksService.getTasks({
		...pagination,
		topLayerTasks: strToBool(topLayerTasks),
		title,
	})

	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<Header />

			<DashboardTable
				data={tasksData.tasks}
				pagination={{ ...pagination, pages: tasksData.pages }}
			/>
			<TaskEditor />
		</section>
	)
}

export default DashboardPage
