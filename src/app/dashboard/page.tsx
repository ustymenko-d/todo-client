import { cookies } from 'next/headers'
import TasksService from '@/services/tasks.service'
import Head from '@/components/pages/dashboard/Head'
import TaskEditor from '@/components/Tasks/Editor/Editor'
import DashboardTable from '@/components/pages/dashboard/DashboardTable/DashboardTable'
import EmptyPlaceholder from '@/components/pages/dashboard/DashboardTable/EmptyPlaceholder'

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
		page = 1,
		limit = 25,
		title,
		topLayerTasks = true,
	} = await searchParams

	const pagination = {
		page: +page,
		limit: +limit,
	}

	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const { data } = await TasksService.getTasks(
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

	const { tasks, pages } = data

	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<Head />
			{data ? (
				<DashboardTable
					data={tasks}
					pagination={{ ...pagination, pages }}
				/>
			) : (
				<EmptyPlaceholder />
			)}
			<TaskEditor />
		</section>
	)
}

export default DashboardPage
