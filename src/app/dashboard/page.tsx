import DashboardTable from '@/components/Dashboard/Table/DashboardTable'

const DashboardPage = () => {
	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div className='flex flex-col'>
					<h1 className='text-2xl font-bold tracking-tight'>Welcome back!</h1>
					<p className='text-base text-muted-foreground'>
						Here&apos;s a list of your tasks
					</p>
				</div>
			</div>

			<DashboardTable />
		</section>
	)
}

export default DashboardPage
