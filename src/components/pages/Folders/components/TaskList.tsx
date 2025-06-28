'use client'

import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import Loader from '@/components/ui/Loader'
import { TASK_FETCH_LIMIT } from '@/const'
import useInfiniteFetch from '@/hooks/tasks/useInfiniteFetch'
import useAppStore from '@/store/store'
import { IFolder } from '@/types/folders'

import Task from './Task'

const TaskList = ({ id }: IFolder) => {
	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteFetch({ folderId: id, limit: TASK_FETCH_LIMIT })

	const setIsFetching = useAppStore((s) => s.setIsFetching)

	useEffect(() => {
		setIsFetching(isFetching)
	}, [isFetching, setIsFetching])

	const tasks = data?.pages.flatMap((page) => page.tasks) ?? []

	if (isLoading)
		return (
			<Loader className='flex items-center justify-center px-6 py-4 border-t' />
		)

	if (tasks.length === 0)
		return (
			<p className='text-center text-muted-foreground px-6 py-4 border-t'>
				Does not contain any tasks yet
			</p>
		)

	return (
		<div
			id={`scrollable-folder-${id}`}
			className='px-6 py-4 overflow-auto border-t max-h-60'>
			{tasks.length > 0 ? (
				<InfiniteScroll
					dataLength={tasks.length}
					next={fetchNextPage}
					hasMore={!!hasNextPage}
					scrollableTarget={`scrollable-folder-${id}`}
					loader={null}
					endMessage={
						<p className='mt-4 text-center text-muted-foreground'>
							No more tasks
						</p>
					}>
					<ul className='space-y-2'>
						{tasks.map((task) => (
							<Task
								key={task.id}
								task={task}
							/>
						))}
					</ul>
					{isFetchingNextPage && <Loader className='justify-center py-2' />}
				</InfiniteScroll>
			) : (
				<p className='text-center text-muted-foreground'>
					Does not contain any tasks yet
				</p>
			)}
		</div>
	)
}

export default TaskList
