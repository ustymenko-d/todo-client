import Head from '@/components/HomePage/Head'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import NavigationItem from '@/components/HomePage/NavigationItem'
import UnverifiedAlert from '@/components/HomePage/UnverifiedAlert'
import { navItems, TNavItem } from '@/const'
import { LayoutGrid } from 'lucide-react'

const HomePage = () => (
	<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8 flex flex-col'>
		<Head />
		<div className='grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 xl:grid-cols-4'>
			<Card className='h-full p-4 flex flex-col gap-2 items-center text-center bg-muted text-primary font-medium cursor-default'>
				<LayoutGrid
					size={40}
					strokeWidth={1}
					className='opacity-50'
				/>
				<CardTitle>Home</CardTitle>
				<CardDescription className='hidden sm:inline-block'>
					Access the main navigation and overview of the application
				</CardDescription>
			</Card>

			{navItems.map((item: TNavItem, index: number) =>
				index === 0 ? null : (
					<NavigationItem
						key={item.href}
						navItem={item}
					/>
				)
			)}
		</div>
		<UnverifiedAlert />
	</section>
)

export default HomePage
