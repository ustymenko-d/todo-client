import PageSection from '@/components/ui/PageSection'
import Head from '@/components/HomePage/Head'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import NavigationItem from '@/components/HomePage/NavigationItem'
import UnverifiedAlert from '@/components/HomePage/UnverifiedAlert'
import { navItems } from '@/const'
import { LayoutGrid } from 'lucide-react'
import { TNavItem } from '@/types/common'

const HomePage = () => (
	<PageSection>
		<Head />
		<div className='grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 xl:grid-cols-4'>
			<Card className='flex flex-col items-center h-full gap-2 p-4 font-medium text-center cursor-default bg-muted text-primary'>
				<LayoutGrid
					size={40}
					strokeWidth={1}
					className='opacity-50'
				/>
				<CardTitle>Home</CardTitle>
				<CardDescription className='hidden text-sm sm:inline-block'>
					Access the main navigation and overview of the application
				</CardDescription>
			</Card>

			{navItems.slice(1).map((item: TNavItem) => (
				<NavigationItem
					key={item.href}
					{...item}
				/>
			))}
		</div>
		<UnverifiedAlert />
	</PageSection>
)

export default HomePage
