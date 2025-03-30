import TasksService from '@/services/api/tasks'
import Head from '@/components/routes/Dashboard/Head'
import TaskEditor from '@/components/TaskEditor/TaskEditor'
import DashboardTable from '@/components/routes/Dashboard/DashboardTable/DashboardTable'
import { PageProps } from '../../../.next/types/app/dashboard/page'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/token'
import EmptyPlaceholder from '@/components/routes/Dashboard/EmptyPlaceholder'

interface DashboardPageProps extends PageProps {
	searchParams: Promise<{
		limit?: string
		page?: string
		title?: string
		topLayerTasks?: string
	}>
}

const strToBool = (value?: string): boolean =>
	value?.trim().toLowerCase() === 'true' || false

const getAccessToken = async () => {
	const cookieStore = await cookies()
	return cookieStore.get('access_token')?.value
}

const fetchTasks = async (
	page: number,
	limit: number,
	title: string,
	topLayerTasks: boolean
) => {
	try {
		const { data } = await TasksService.getTasks({
			page,
			limit,
			topLayerTasks:
				typeof topLayerTasks === 'string'
					? strToBool(topLayerTasks)
					: topLayerTasks,
			title,
		})
		return data
	} catch (error) {
		console.error('Failed to fetch tasks:', error)
		return null
	}
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
	const {
		page = 1,
		limit = 25,
		title = '',
		topLayerTasks = 'true',
	} = await searchParams

	const accessToken = await getAccessToken()
	let tasksData = null

	const pagination = {
		page: +page,
		limit: +limit,
	}

	if (accessToken && verifyToken(accessToken))
		tasksData = await fetchTasks(+page, +limit, title, !!topLayerTasks)

	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<Head />

			{tasksData ? (
				<DashboardTable
					data={tasksData.tasks}
					pagination={{ ...pagination, pages: tasksData.pages }}
				/>
			) : (
				<EmptyPlaceholder />
			)}

			<TaskEditor />
		</section>
	)
}

export default DashboardPage
