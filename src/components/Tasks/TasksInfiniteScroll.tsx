'use client'

import { HTMLAttributes, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import TaskContextMenu from '@/components/Tasks/TaskContextMenu'
import Loader from '@/components/ui/Loader'
import { Separator } from '@/components/ui/separator'
import useInfiniteFetch from '@/hooks/tasks/useInfiniteFetch'
import useAppStore from '@/store/store'
import { TGetTasksRequest, TTask } from '@/types/tasks'

import DraggableItem from '../pages/Folders/components/DraggableItem'
import TaskCard from './TaskCard'

interface ITasksInfiniteScrollProps extends HTMLAttributes<HTMLDivElement> {
	fetchParams: Omit<TGetTasksRequest, 'page'>
	type: 'folder' | 'quickList'
}

const TasksInfiniteScroll = ({
	id,
	className,
	fetchParams,
	type,
}: ITasksInfiniteScrollProps) => {
	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteFetch(fetchParams)

	const setIsFetching = useAppStore((s) => s.setIsFetching)

	useEffect(() => {
		setIsFetching(isFetching)
	}, [isFetching, setIsFetching])

	const tasks = data?.pages.flatMap((page) => page.tasks) ?? []

	const renderTaskItem = (task: TTask) => (
		<TaskContextMenu
			key={task.id}
			task={task}>
			{type === 'folder' ? (
				<DraggableItem task={task} />
			) : (
				<TaskCard
					task={task}
					withCheckbox
				/>
			)}
		</TaskContextMenu>
	)

	const renderHeader = () => (
		<>
			<div className='flex items-center mb-2 pl-11 text-muted-foreground'>
				<span className='grow'>Title</span>
				<span className='min-w-[112px]'>Status</span>
			</div>
			<Separator className='mb-2' />
		</>
	)

	const renderEmptyMessage = () => (
		<p className='px-6 py-4 text-center text-muted-foreground'>
			Does not have any tasks yet
		</p>
	)

	const renderLoader = () => (
		<Loader className='flex items-center justify-center px-6 py-4' />
	)

	return (
		<div
			id={id}
			className={className}>
			{isLoading && renderLoader()}

			{!isLoading && tasks.length === 0 && renderEmptyMessage()}

			{tasks.length > 0 && (
				<InfiniteScroll
					dataLength={tasks.length}
					next={fetchNextPage}
					hasMore={!!hasNextPage}
					scrollableTarget={id}
					loader={null}
					endMessage={
						<p className='mt-4 text-center text-muted-foreground'>
							No more tasks
						</p>
					}>
					{renderHeader()}
					<ul className='space-y-2'>{tasks.map(renderTaskItem)}</ul>
					{isFetchingNextPage && <Loader className='justify-center py-2' />}
				</InfiniteScroll>
			)}
		</div>
	)
}

export default TasksInfiniteScroll
