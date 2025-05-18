import PageSection from '@/components/ui/PageSection'
import Head from '@/components/FoldersPage/Head'
import Body from '@/components/FoldersPage/Body'
import Editor from '@/components/FoldersPage/Editor'
import TaskEditor from '@/components/Tasks/Editor/Editor'

const FoldersPage = () => (
	<PageSection>
		<Head />
		<Body />
		<Editor />
		<TaskEditor />
	</PageSection>
)

export default FoldersPage
