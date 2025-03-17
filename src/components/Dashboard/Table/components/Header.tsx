import { Input } from '@/components/ui/input'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Settings2 } from 'lucide-react'
import { TableComponentsProps } from '../Table'

const Header = <TData,>({ table }: TableComponentsProps<TData>) => {
	return (
		<div className='flex items-center gap-4 py-4'>
			<Input
				placeholder='Filter by title...'
				value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
				onChange={(event) =>
					table.getColumn('title')?.setFilterValue(event.target.value)
				}
				className='max-w-sm'
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
					{table
						.getAllColumns()
						.filter((column) => column.getCanHide())
						.map((column) => {
							if (column.id !== 'title') {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}>
										{column.id}
									</DropdownMenuCheckboxItem>
								)
							}
						})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default Header
