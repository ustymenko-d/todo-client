import HomeLink from '@/components/HomeLink'

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

		<div className='flex flex-col gap-2'>
			<p className='text-base text-center xl:text-lg text-muted-foreground'>
				Please log in to your account or create a new one to continue.
			</p>

			<div className='grid grid-cols-2 gap-2 mx-auto w-fit'>
				<HomeLink type='login' />
				<HomeLink type='signup' />
			</div>
		</div>
	</>
)

export default RootPage
