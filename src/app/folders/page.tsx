import Body from '@/components/FoldersPage/Body'
import Head from '@/components/FoldersPage/Head'
import Editor from '@/components/FoldersPage/components/Editor'

const FoldersPage = () => (
	<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
		<Head />
		<Body />
		<Editor />
	</section>
)

export default FoldersPage
