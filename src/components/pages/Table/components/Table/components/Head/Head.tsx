'use client'

import { Plus } from 'lucide-react'

import { ITableComponentProps } from '@/components/pages/Table/components/Table/Table'
import { Button } from '@/components/ui/button'
import useBreakpoints from '@/hooks/useBreakpoints'
import useAppStore from '@/store/store'

import ColumnsViewSettings from './components/ColumnsViewSettings'
import SearchInput from './components/SearchInput'

const Head = ({ table }: ITableComponentProps) => {
	const { widthIndex } = useBreakpoints({ width: [640] })

	const openTaskEditor = useAppStore((s) => s.openTaskEditor)

	return (
		<div className='flex items-center gap-4 py-4'>
			<SearchInput />

			<Button onClick={() => openTaskEditor('create', null)}>
				<Plus />
				<span className='text-sm sm:text-base'>
					{!!widthIndex ? 'Add task' : 'Add'}
				</span>
			</Button>

			<ColumnsViewSettings table={table} />
		</div>
	)
}

export default Head
