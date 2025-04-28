import Link from 'next/link'

const DashboardPage = () => {
	return (
		<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
			<Link href='/table'>table</Link>
			<Link href='/folders'>folders</Link>
			<Link href='/settings'>settings</Link>
		</section>
	)
}

export default DashboardPage
