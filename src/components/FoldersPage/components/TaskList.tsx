import InfiniteScroll from 'react-infinite-scroll-component'
import Task from './Task'
import { TTask } from '@/types/tasks'
import { Loader2 } from 'lucide-react'

interface ITaskListProps {
	folderId: string
	tasks: TTask[]
	hasMore: boolean
	loadMoreTasks: () => void
	taskLoading: boolean
}

const TaskList = ({
	folderId,
	tasks,
	hasMore,
	loadMoreTasks,
	taskLoading,
}: ITaskListProps) => {
	return (
		<div
			id={`scrollable-folder-${folderId}`}
			className='px-6 py-4 overflow-auto border-t max-h-60'>
			{tasks.length > 0 ? (
				<InfiniteScroll
					dataLength={tasks.length}
					next={loadMoreTasks}
					hasMore={hasMore}
					scrollableTarget={`scrollable-folder-${folderId}`}
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
					{taskLoading && (
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
