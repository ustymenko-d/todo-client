import AddTask from '@/components/AddTask/AddTask'
import DashboardTable from '@/components/Dashboard/Table/DashboardTable'
import { redirect } from 'next/navigation'

const DashboardPage = async ({
	searchParams,
}: {
	searchParams: { page?: string; limit?: string }
}) => {
	const { page, limit } = await searchParams

	if (!page || !limit) {
		redirect(`/dashboard?page=1&limit=5`)
	}

	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
				<div className='flex flex-col'>
					<h1 className='text-2xl font-bold tracking-tight'>Welcome back!</h1>
					<p className='text-base text-muted-foreground'>
						Here&apos;s a list of your tasks
					</p>
				</div>

				<AddTask />
			</div>

			<DashboardTable
				page={page}
				limit={limit}
			/>
		</section>
	)
}

export default DashboardPage
