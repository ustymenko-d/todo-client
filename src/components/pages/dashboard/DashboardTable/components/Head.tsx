'use client'

import { ChangeEvent, useEffect, useMemo, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import useAppStore from '@/store/store'
import useBreakpoints from '@/hooks/useBreakpoints'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ITableComponentProps } from '../DashboardTable'
import { Loader2, Plus, Settings2 } from 'lucide-react'

const defaultColumns = ['completed', 'title', 'actions']

const Head = ({ table }: ITableComponentProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const breakpoints = useBreakpoints([639])
	const [isPending, startTransition] = useTransition()
	const searchTerm = useAppStore((state) => state.searchTerm)
	const setSearchTerm = useAppStore((state) => state.setSearchTerm)
	const openTaskEditor = useAppStore((state) => state.openTaskEditor)

	const handleSearchChange = useMemo(
		() =>
			debounce((value: string) => {
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
			}, 1000),
		[router]
	)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchTerm(value)
		handleSearchChange(value)
	}

	const renderColumnVisibility = () =>
		table
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

	useEffect(() => {
		setSearchTerm(searchParams.get('title') || '')
	}, [searchParams, setSearchTerm])

	useEffect(() => {
		return () => {
			handleSearchChange.cancel()
		}
	}, [handleSearchChange])

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
					<div className='flex items-center gap-2'>
						<Loader2
							strokeWidth={1.5}
							className='w-5 h-5 text-gray-500 animate-spin'
						/>
						<span className='text-muted-foreground'>Searching...</span>
					</div>
				)}
			</div>

			<Button onClick={() => openTaskEditor('create', null)}>
				<Plus />
				<span>{!!breakpoints ? 'Add task' : 'Add'}</span>
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						className='ml-auto min-w-9'
						size={!!breakpoints ? 'default' : 'icon'}>
						<Settings2 />
						{!!breakpoints && <span className='hidden sm:block'>View</span>}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					{renderColumnVisibility()}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default Head
