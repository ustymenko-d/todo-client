import { LayoutGrid } from 'lucide-react'

import Head from '@/components/pages/Home/Head'
import NavigationItem from '@/components/pages/Home/NavigationItem'
import QuickList from '@/components/pages/Home/QuickList/QuickList'
import UnverifiedAlert from '@/components/pages/Home/UnverifiedAlert'
import PageSection from '@/components/PageSection'
import DetailsDialog from '@/components/Tasks/DetailsDialog/DetailsDialog'
import TaskEditor from '@/components/Tasks/Editor/Editor'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { navItems } from '@/const'
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

		<QuickList />
		<TaskEditor />
		<DetailsDialog />
	</PageSection>
)

export default HomePage
