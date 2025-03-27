import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

interface ColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

const getSortingIcon = (sortState: string | false) => {
	if (sortState === 'desc') return <ArrowDown />
	if (sortState === 'asc') return <ArrowUp />
	return <ChevronsUpDown />
}

const ColumnHeader = <TData, TValue>({
	column,
	title,
	className,
}: ColumnHeaderProps<TData, TValue>) => {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='w-full data-[state=open]:bg-accent'>
					<span>{title}</span>
					{getSortingIcon(column.getIsSorted())}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start'>
				<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
					<ArrowUp className='h-3.5 w-3.5 text-muted-foreground/70' />
					Asc
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
					<ArrowDown className='h-3.5 w-3.5 text-muted-foreground/70' />
					Desc
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ColumnHeader
