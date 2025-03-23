'use client'

import { FC, useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ITableComponentProps } from '../DashboardTable'
import { Loader2, Settings2 } from 'lucide-react'

const defaultColumns = ['completed', 'title', 'actions']

const Header: FC<ITableComponentProps> = ({ table }) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [searchTerm, setSearchTerm] = useState<string>(
		searchParams.get('title') || ''
	)
	const [isPending, startTransition] = useTransition()

	const handleSearchChange = debounce((value: string) => {
		startTransition(() => {
			const params = new URLSearchParams()
			if (value) {
				params.set('title', value)
				params.set('page', '1')
				params.set('topLayerTasks', 'false')
			} else {
				params.set('topLayerTasks', 'true')
			}
			router.push(`?${params.toString()}`, { scroll: false })
		})
	}, 300)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchTerm(value)
		handleSearchChange(value)
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

	useEffect(() => {
		setSearchTerm(searchParams.get('title') || '')
	}, [searchParams])

	return (
		<div className='flex items-center gap-4 py-4'>
			<div className='flex items-center gap-2'>
				<Input
					className='max-w-sm'
					value={searchTerm}
					onChange={(e) => handleChange(e)}
					placeholder='Search by title...'
				/>
				{isPending && (
					<div className='flex items-center'>
						<Loader2 className='h-5 w-5 animate-spin text-gray-500' />
						<span>Searching...</span>
					</div>
				)}
			</div>

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
