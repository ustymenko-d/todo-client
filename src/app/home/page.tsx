import Head from '@/components/HomePage/Head'
import NavigationItem from '@/components/HomePage/NavigationItem'
import { navItems, TNavItem } from '@/const'

const HomePage = () => (
	<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
		<Head />
		<div className='pt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
			{navItems.map((item: TNavItem) => (
				<NavigationItem
					key={item.href}
					navItem={item}
				/>
			))}
		</div>
	</section>
)

export default HomePage
