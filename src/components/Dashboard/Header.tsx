import AddTask from '../AddTask/AddTask'

const Header = () => {
	return (
		<div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
			<div className='flex flex-col'>
				<h1 className='text-2xl font-bold tracking-tight'>Welcome back!</h1>
				<p className='text-base text-muted-foreground'>
					Here&apos;s a list of your tasks
				</p>
			</div>

			<AddTask />
		</div>
	)
}

export default Header
