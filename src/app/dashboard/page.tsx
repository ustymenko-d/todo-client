import DashboardHeader from '@/components/Dashboard/DashboardHeader'

const DashboardPage = () => {
	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<DashboardHeader />
		</section>
	)
}

export default DashboardPage
