import { redirect } from 'next/navigation'
import Head from '@/components/routes/Dashboard/Head'
import TaskEditor from '@/components/TaskEditor/TaskEditor'
import DashboardTable from '@/components/routes/Dashboard/DashboardTable/DashboardTable'
import { PageProps } from '../../../.next/types/app/dashboard/page'
import TasksService from '@/services/tasks.service'

interface DashboardPageProps extends PageProps {
	searchParams: Promise<{
			limit?: string;
			page?: string;
			title?: string;
			topLayerTasks?: string;
	}>;
}

const strToBool = (value?: string): boolean =>
	value?.trim().toLowerCase() === 'true' || false

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
	const {
		page = '1',
		limit = '25',
		title,
		topLayerTasks = true,
	} = await searchParams

	if (!page || !limit) {
		redirect(`/dashboard?page=1&limit=5&topLayerTasks=true`)
	}

	const pagination = {
		page: +page,
		limit: +limit,
	}

	const { data } = await TasksService.getTasks({
		...pagination,
		topLayerTasks:
			typeof topLayerTasks === 'string'
				? strToBool(topLayerTasks)
				: topLayerTasks,
		title,
	})

	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<Head />
			<DashboardTable
				data={data.tasks}
				pagination={{ ...pagination, pages: data.pages }}
			/>
			<TaskEditor />
		</section>
	)
}

export default DashboardPage
