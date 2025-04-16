import Head from '@/components/dashboard/Head'
import TaskEditor from '@/components/TaskEditor/TaskEditor'
import DashboardTable from '@/components/dashboard/DashboardTable/DashboardTable'
import TasksService from '@/services/Axios/tasks.service'
import { cookies } from 'next/headers'

interface DashboardPageProps {
	searchParams: Promise<{
		limit?: string
		page?: string
		title?: string
		topLayerTasks?: string
	}>
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

	const pagination = {
		page: +page,
		limit: +limit,
	}

	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const { data: axiosData } = await TasksService.getTasks(
		{
			...pagination,
			topLayerTasks:
				typeof topLayerTasks === 'string'
					? strToBool(topLayerTasks)
					: topLayerTasks,
			title,
		},
		{
			headers: {
				Cookie: cookieHeader,
			},
		}
	)
	const { data } = axiosData

	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<Head />
			{data && (
				<DashboardTable
					data={data.tasks}
					pagination={{ ...pagination, pages: data.pages }}
				/>
			)}
			<TaskEditor />
		</section>
	)
}

export default DashboardPage
