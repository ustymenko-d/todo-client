'use client'

import { Plus } from 'lucide-react'

import TasksInfiniteScroll from '@/components/Tasks/TasksInfiniteScroll'
import { TASK_FETCH_LIMIT } from '@/const'
import useBreakpoints from '@/hooks/useBreakpoints'
import useAppStore from '@/store/store'

import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'

const QuickList = () => {
	const { widthIndex } = useBreakpoints({ width: [640] })

	const openTaskEditor = useAppStore((s) => s.openTaskEditor)

	return (
		<div className='pt-4'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h2 className='text-xl font-semibold'>Quick list</h2>

				<Button onClick={() => openTaskEditor('create', null)}>
					<Plus />
					<span className='text-sm sm:text-base'>
						{!!widthIndex ? 'Add task' : 'Add'}
					</span>
				</Button>
			</div>

			<Separator className='my-2' />

			<TasksInfiniteScroll
				type='quickList'
				fetchParams={{ limit: TASK_FETCH_LIMIT }}
				id='quick-list'
				className='p-4 overflow-auto duration-300 border sm:p-6 max-h-96 rounded-xl'
			/>
		</div>
	)
}

export default QuickList
