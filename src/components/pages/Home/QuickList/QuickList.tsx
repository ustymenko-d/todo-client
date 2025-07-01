'use client'

import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import TaskContextMenu from '@/components/Tasks/TaskContextMenu'
import { TASK_FETCH_LIMIT } from '@/const'
import useInfiniteFetch from '@/hooks/tasks/useInfiniteFetch'
import useBreakpoints from '@/hooks/useBreakpoints'
import useAppStore from '@/store/store'

import { Button } from '../../../ui/button'
import Loader from '../../../ui/Loader'
import { Separator } from '../../../ui/separator'
import TaskCard from './components/TaskCard'

const QuickList = () => {
	const { widthIndex } = useBreakpoints({ width: [640] })

	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteFetch({ limit: TASK_FETCH_LIMIT })

	const setIsFetching = useAppStore((s) => s.setIsFetching)
	const openTaskEditor = useAppStore((s) => s.openTaskEditor)

	useEffect(() => {
		setIsFetching(isFetching)
	}, [isFetching, setIsFetching])

	const tasks = data?.pages.flatMap((page) => page.tasks) ?? []

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

			<div
				id='quick-list-wrapper'
				className='p-4 overflow-auto duration-300 border sm:p-6 max-h-96 rounded-xl'>
				{isLoading && (
					<Loader className='flex items-center justify-center px-6 py-4' />
				)}

				{tasks.length === 0 && !isLoading && (
					<p className='px-6 py-4 text-center text-muted-foreground'>
						Does not have any tasks yet
					</p>
				)}

				{tasks.length > 0 && (
					<InfiniteScroll
						dataLength={tasks.length}
						next={fetchNextPage}
						hasMore={!!hasNextPage}
						scrollableTarget='quick-list-wrapper'
						loader={null}
						endMessage={
							<p className='mt-4 text-center text-muted-foreground'>
								No more tasks
							</p>
						}>
						<div className='pl-11 flex items-center text-muted-foreground mb-2'>
							<span className='grow'>Title</span>
							<span className='min-w-[112px]'>Status</span>
						</div>

						<Separator className='mb-2' />

						<ul className='space-y-2'>
							{tasks.map((task) => (
								<TaskContextMenu
									key={task.id}
									task={task}>
									<TaskCard task={task} />
								</TaskContextMenu>
							))}
						</ul>
						{isFetchingNextPage && <Loader className='justify-center py-2' />}
					</InfiniteScroll>
				)}
			</div>
		</div>
	)
}

export default QuickList
