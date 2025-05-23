import AuthLink from '@/components/ui/AuthLink'

const RootPage = () => (
	<div className='flex flex-col gap-12 mb-6'>
		<h1 className='font-extrabold text-center leading-none text-[max(48px,min(5vw,76px))]'>
			Welcome to UpTodo!
		</h1>

		<div className='flex flex-col gap-2'>
			<p className='w-11/12 mx-auto text-xl font-bold text-center lg:w-full sm:text-2xl lg:text-3xl'>
				Manage and organize your{'\u00A0'}tasks
			</p>

			<p className='w-3/4 mx-auto mb-4 text-base text-center xl:text-lg text-muted-foreground'>
				Please log in to your account or create a new one to{'\u00A0'}continue.
			</p>

			<div className='grid grid-cols-2 gap-4 mx-auto w-fit'>
				<AuthLink type='signin' />
				<AuthLink type='signup' />
			</div>
		</div>
	</div>
)

export default RootPage
