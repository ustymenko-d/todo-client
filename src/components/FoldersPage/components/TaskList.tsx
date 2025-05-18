import { useCallback, useEffect, useState } from 'react'
import useMergeFetchedTasks from '@/hooks/useMergeFetchedTasks'
import TasksService from '@/services/tasks.service'
import InfiniteScroll from 'react-infinite-scroll-component'
import Task from './Task'
import { Loader2 } from 'lucide-react'
import { TASK_FETCH_LIMIT } from '@/const'
import { IFolderWithTasks } from '@/types/folders'

const TaskList = ({
	folder,
	showTasks,
}: {
	folder: IFolderWithTasks
	showTasks: boolean
}) => {
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const { mergeFetchedTasks } = useMergeFetchedTasks()

	const { id, tasks = [] } = folder

	const fetchTasks = useCallback(
		async (page: number) => {
			try {
				setLoading(true)

				const { data } = await TasksService.getTasks({
					page,
					limit: TASK_FETCH_LIMIT,
					folderId: id,
				})

				mergeFetchedTasks(id, data)
				setHasMore(page < data.pages)
			} catch (error) {
				console.error('[Folder] Fetch tasks error: ', error)
			} finally {
				setLoading(false)
			}
		},
		[id, mergeFetchedTasks]
	)

	const loadMoreTasks = () => {
		if (hasMore && !loading) {
			const nextPage = tasks.length / TASK_FETCH_LIMIT + 1
			fetchTasks(Math.floor(nextPage))
		}
	}

	useEffect(() => {
		if (showTasks && !folder.limit && hasMore && !loading) {
			fetchTasks(1)
		}
	}, [showTasks, folder.limit, hasMore, loading, fetchTasks])

	if (!showTasks) return null

	if (tasks.length === 0 && loading) {
		return (
			<div className='flex items-center justify-center gap-2 px-6 py-4 border-t text-muted-foreground'>
				<Loader2
					strokeWidth={1.5}
					className='animate-spin'
					size={16}
				/>
				<p>Loading...</p>
			</div>
		)
	}

	return (
		<div
			id={`scrollable-folder-${id}`}
			className='px-6 py-4 overflow-auto border-t max-h-60'>
			{tasks.length > 0 ? (
				<InfiniteScroll
					dataLength={tasks.length}
					next={loadMoreTasks}
					hasMore={hasMore}
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
					{loading && (
						<div className='flex items-center justify-center gap-2 mt-4 text-muted-foreground'>
							<Loader2
								strokeWidth={1.5}
								className='animate-spin'
								size={16}
							/>
							<p>Loading...</p>
						</div>
					)}
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
