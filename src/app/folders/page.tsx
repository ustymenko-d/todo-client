import Body from '@/components/FoldersPage/Body'
import Editor from '@/components/FoldersPage/Editor'
import Head from '@/components/FoldersPage/Head'
import DetailsDialog from '@/components/Tasks/DetailsDialog/DetailsDialog'
import TaskEditor from '@/components/Tasks/Editor/Editor'
import PageSection from '@/components/ui/PageSection'

const FoldersPage = () => (
	<PageSection>
		<Head />
		<Body />
		<Editor />
		<TaskEditor />
		<DetailsDialog />
	</PageSection>
)

export default FoldersPage
