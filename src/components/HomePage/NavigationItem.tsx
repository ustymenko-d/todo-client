import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { TNavItem } from '@/const'
import Link from 'next/link'

const NavigationItem = ({ navItem }: { navItem: TNavItem }) => {
	const { href, icon: Icon, label, description } = navItem
	const isActive = href === '/home'

	return (
		<Link href={href}>
			<Card
				className={`h-full p-4 flex flex-col gap-2 items-center text-center ${
					isActive ? 'bg-muted text-primary font-medium' : 'hover:bg-accent'
				}`}>
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
