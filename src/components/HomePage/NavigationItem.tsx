import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { TNavItem } from '@/types/common'

const NavigationItem = ({ navItem }: { navItem: TNavItem }) => {
	const { href, icon: Icon, label, description } = navItem

	return (
		<Link href={href}>
			<Card className='flex flex-col items-center h-full gap-2 p-4 text-center hover:bg-accent'>
				<Icon
					size={40}
					strokeWidth={1}
					className='opacity-50'
				/>
				<CardTitle>{label}</CardTitle>
				<CardDescription className='hidden sm:inline-block'>
					{description}
				</CardDescription>
			</Card>
		</Link>
	)
}

export default NavigationItem
