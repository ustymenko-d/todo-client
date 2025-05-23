import { stringToBoolean } from '@/utils/formatting'
import PageSection from '@/components/ui/PageSection'
import PageHead from '@/components/PageHead'
import TaskEditor from '@/components/Tasks/Editor/Editor'
import Body from '@/components/TablePage/Body'

interface TablePageProps {
	searchParams: Promise<{
		limit?: string
		page?: string
		title?: string
		topLayerTasks?: string
	}>
}

const headProps = {
	title: 'Manage and organize your tasks',
	description:
		'You can view the details of the task by clicking on it or you can edit the task using the\u00A0context\u00A0menu (right\u00A0click)',
} as const

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
		title,
		topLayerTasks:
			typeof topLayerTasks === 'string'
				? stringToBoolean(topLayerTasks)
				: topLayerTasks,
	}

	return (
		<PageSection>
			<PageHead {...headProps} />
			<Body {...pagination} />
			<TaskEditor />
		</PageSection>
	)
}

export default TablePage
