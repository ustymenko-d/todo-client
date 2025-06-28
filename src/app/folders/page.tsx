import Body from '@/components/pages/Folders/Body'
import Editor from '@/components/pages/Folders/Editor'
import Head from '@/components/pages/Folders/Head'
import PageSection from '@/components/PageSection'
import DetailsDialog from '@/components/Tasks/DetailsDialog/DetailsDialog'
import TaskEditor from '@/components/Tasks/Editor/Editor'

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
