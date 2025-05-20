import { cookies } from 'next/headers'
import { stringToBoolean } from '@/utils/formatting'
import TasksService from '@/services/tasks.service'
import PageSection from '@/components/ui/PageSection'
import PageHead from '@/components/PageHead'
import EmptyPlaceholder from '@/components/TablePage/EmptyPlaceholder'
import Table from '@/components/TablePage/Table'
import TaskEditor from '@/components/Tasks/Editor/Editor'

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
		<PageSection>
			<PageHead
				title='Manage and organize your tasks'
				description={
					'You can view the details of the task by clicking on it or you can edit the task using the context\u00A0menu (right\u00A0click)'
				}
			/>

			{data ? (
				<Table
					data={tasks}
					pagination={{ ...pagination, pages }}
				/>
			) : (
				<EmptyPlaceholder />
			)}
			<TaskEditor />
		</PageSection>
	)
}

export default TablePage
