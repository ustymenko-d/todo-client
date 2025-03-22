import { FC } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ITableComponentProps } from '../DashboardTable'
import { Settings2 } from 'lucide-react'

const defaultColumns = ['completed', 'title', 'actions']

const Header: FC<ITableComponentProps> = ({ table }) => {
	const titleFilterValue =
		(table.getColumn('title')?.getFilterValue() as string) ?? ''

	const handleTitleFilterChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		table.getColumn('title')?.setFilterValue(event.target.value)
	}

	const renderColumnVisibility = () => {
		return table
			.getAllColumns()
			.filter(
				(column) => column.getCanHide() && !defaultColumns.includes(column.id)
			)
			.map((column) => (
				<DropdownMenuCheckboxItem
					key={column.id}
					className='capitalize'
					checked={column.getIsVisible()}
					onCheckedChange={(value) => column.toggleVisibility(!!value)}>
					{column.id}
				</DropdownMenuCheckboxItem>
			))
	}

	return (
		<div className='flex items-center gap-4 py-4'>
			<Input
				className='max-w-sm'
				value={titleFilterValue}
				onChange={handleTitleFilterChange}
				placeholder='Filter by title...'
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						className='ml-auto'>
						<Settings2 />
						View
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					{renderColumnVisibility()}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default Header
