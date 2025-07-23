import { Column } from '@tanstack/react-table'
import {
	ArrowDown,
	ArrowDownUp,
	ArrowDownWideNarrow,
	ArrowUp,
	ArrowUpNarrowWide,
} from 'lucide-react'
import { HTMLAttributes } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Props<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

const getSortingIcon = (sortState: string | false) =>
	sortState === 'desc' ? (
		<ArrowDownWideNarrow />
	) : sortState === 'asc' ? (
		<ArrowUpNarrowWide />
	) : (
		<ArrowDownUp />
	)

const Header = <TData, TValue>({ column, title, className }: Props<TData, TValue>) => {
	if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='w-full lg:text-base data-[state=open]:bg-accent'>
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

export default Header
