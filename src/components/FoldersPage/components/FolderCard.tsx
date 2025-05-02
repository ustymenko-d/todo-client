import { useCallback, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteDialog from '@/components/DeleteDialog'
import { Label } from '@/components/ui/label'
import TaskList from './TaskList'
import TooltipButton from './TooltipButton'
import { IFolder } from '@/types/folders'
import { ListTodo, Loader2, PenLine, Trash2 } from 'lucide-react'
import TasksService from '@/services/tasks.service'
import { TTask } from '@/types/tasks'

interface FolderCardProps {
	folder: IFolder
	isLoading: boolean
	onEdit: () => void
	onDelete: () => void
}

const LIMIT = 10

const FolderCard = ({
	folder,
	isLoading,
	onEdit,
	onDelete,
}: FolderCardProps) => {
	const [openAlert, setOpenAlert] = useState(false)
	const [showTasks, setShowTasks] = useState(false)
	const [tasks, setTasks] = useState<TTask[]>([])
	const [taskLoading, setTaskLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)

	const fetchTasks = useCallback(
		async (currentPage: number) => {
			setTaskLoading(true)
			try {
				const { data } = await TasksService.getTasks({
					page: currentPage,
					limit: LIMIT,
					folderId: folder.id,
				})
				const { tasks: newTasks, pages } = data
				setTasks((prev) => [...prev, ...newTasks])
				setHasMore(currentPage < pages)
			} catch (error) {
				console.error('[Folder] Fetch tasks error: ', error)
			} finally {
				setTaskLoading(false)
			}
		},
		[folder.id]
	)

	const loadMoreTasks = () => {
		if (!taskLoading && hasMore) {
			const nextPage = page + 1
			setPage(nextPage)
			fetchTasks(nextPage)
		}
	}

	const handleToggleTasks = () => {
		const willShow = !showTasks
		setShowTasks(willShow)

		if (hasMore && !taskLoading && tasks.length === 0) {
			fetchTasks(1)
		}
	}

	return (
		<Card className='h-fit'>
			<CardHeader className='flex-row flex-wrap items-center justify-between gap-x-2 gap-y-1'>
				<CardTitle className='flex flex-col gap-1'>
					<Label className='text-muted-foreground'>Folder name:</Label>
					{folder.name}
				</CardTitle>
				<div className='flex items-center gap-1'>
					<TooltipButton
						size='icon'
						variant='outline'
						label='Show tasks'
						onClick={handleToggleTasks}>
						<ListTodo />
					</TooltipButton>

					<TooltipButton
						size='icon'
						variant='outline'
						label='Rename'
						onClick={onEdit}>
						<PenLine />
					</TooltipButton>

					<TooltipButton
						size='icon'
						variant='destructive'
						label='Delete'
						disabled={isLoading}
						onClick={() => setOpenAlert(true)}>
						{isLoading ? (
							<Loader2
								strokeWidth={1.5}
								className='animate-spin'
							/>
						) : (
							<Trash2 />
						)}
					</TooltipButton>

					<DeleteDialog
						handleDelete={onDelete}
						loading={isLoading}
						deleteTarget='folder'
						open={openAlert}
						onOpenChange={setOpenAlert}
					/>
				</div>
			</CardHeader>

			{showTasks &&
				(tasks.length === 0 && taskLoading ? (
					<div className='flex items-center justify-center gap-2 px-6 py-4 border-t text-muted-foreground'>
						<Loader2
							strokeWidth={1.5}
							className='animate-spin'
							size={16}
						/>
						<p>Loading...</p>
					</div>
				) : (
					<TaskList
						folderId={folder.id}
						tasks={tasks}
						hasMore={hasMore}
						loadMoreTasks={loadMoreTasks}
						taskLoading={taskLoading}
					/>
				))}
		</Card>
	)
}

export default FolderCard
