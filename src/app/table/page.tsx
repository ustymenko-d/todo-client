import TasksService from '@/services/tasks.service'
import { stringToBoolean } from '@/utils/formatting'
import { cookies } from 'next/headers'
import EmptyPlaceholder from '@/components/TablePage/EmptyPlaceholder'
import TaskEditor from '@/components/Tasks/Editor/Editor'
import Table from '@/components/TablePage/Table'

interface TablePageProps {
	searchParams: Promise<{
		limit?: string
		page?: string
		title?: string
		topLayerTasks?: string
	}>
}

const TablePage = async ({ searchParams }: TablePageProps) => {
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
					? stringToBoolean(topLayerTasks)
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
			{data ? (
				<Table
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

export default TablePage
