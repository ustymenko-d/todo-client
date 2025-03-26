import HomeActions from '@/components/routes/Home/Actions'

const RootPage = () => (
	<>
		<div className='flex flex-col gap-2 mb-6'>
			<h1 className='text-3xl font-bold text-center sm:text-4xl xl:text-5xl'>
				Welcome to UpTodo!
			</h1>
			<p className='text-base font-medium text-center sm:text-xl xl:text-2xl'>
				Manage and organize your tasks.
			</p>
		</div>

		<HomeActions />
	</>
)

export default RootPage
