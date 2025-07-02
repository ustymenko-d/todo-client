'use client'

import debounce from 'lodash.debounce'
import { Loader2, Plus, Settings2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useMemo, useTransition } from 'react'

import { ITableComponentProps } from '@/components/pages/Table/components/Table/Table'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import useBreakpoints from '@/hooks/useBreakpoints'
import useAppStore from '@/store/store'

const defaultColumns = ['completed', 'title', 'actions']
const columnLabels: Record<string, string> = {
	description: 'Description',
	folderId: 'Folder',
	startDate: 'Start Date',
	expiresDate: 'Expires Date',
}

const Head = ({ table }: ITableComponentProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()
	const { widthIndex } = useBreakpoints({ width: [640] })

	const searchTerm = useAppStore((s) => s.searchTerm)
	const setSearchTerm = useAppStore((s) => s.setSearchTerm)
	const openTaskEditor = useAppStore((s) => s.openTaskEditor)

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
					{columnLabels[column.id] ?? column.id}
				</DropdownMenuCheckboxItem>
			))

	useEffect(() => {
		setSearchTerm(searchParams.get('title') || '')
	}, [searchParams, setSearchTerm])

	useEffect(
		() => () => {
			handleSearchChange.cancel()
		},
		[handleSearchChange]
	)

	return (
		<div className='flex items-center gap-4 py-4'>
			<div className='flex items-center gap-2 relative'>
				<Input
					className='max-w-sm pe-8'
					value={searchTerm}
					onChange={(e) => handleChange(e)}
					placeholder='Search by title...'
				/>
				{isPending && (
					<Loader2
						strokeWidth={1.25}
						className='absolute right-2 w-5 h-5 text-gray-500 animate-spin'
					/>
				)}
			</div>

			<Button onClick={() => openTaskEditor('create', null)}>
				<Plus />
				<span className='text-sm sm:text-base'>
					{!!widthIndex ? 'Add task' : 'Add'}
				</span>
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						className='ml-auto min-w-9'
						size={!!widthIndex ? 'default' : 'icon'}>
						<Settings2 />
						{!!widthIndex && <span className='hidden sm:block'>View</span>}
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
