import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteDialog from '@/components/DeleteDialog'
import TaskList from './TaskList'
import TooltipButton from './TooltipButton'
import { IFolderWithTasks } from '@/types/folders'
import { ListTodo, Loader2, PenLine, Trash2 } from 'lucide-react'
import TasksService from '@/services/tasks.service'
import useAppStore from '@/store/store'
import { useDroppable } from '@dnd-kit/core'
import { IGetTasksResponse } from '@/types/tasks'

interface FolderCardProps {
	folder: IFolderWithTasks
	isLoading: boolean
	onEdit: () => void
	onDelete: () => void
}

export const TASK_FETCH_LIMIT = 20 as const

const Folder = ({ folder, isLoading, onEdit, onDelete }: FolderCardProps) => {
	const { id, name, userId, tasks = [] } = folder
	const { isOver, setNodeRef } = useDroppable({ id })
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)
	const [openAlert, setOpenAlert] = useState(false)
	const [showTasks, setShowTasks] = useState(false)
	const [taskLoading, setTaskLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const updateFoldersWithTasks = useCallback(
		(getTaskResponse: IGetTasksResponse) => {
			const { limit, tasks, page, pages, total } = getTaskResponse

			setFoldersWithTasks((prev) => {
				const existing = prev.find((folder) => folder.id === id)

				if (existing) {
					const uniqueNewTasks = tasks.filter(
						(task) => !existing.tasks?.some((t) => t.id === task.id)
					)
					return prev.map((folder) =>
						folder.id === id
							? {
									...folder,
									tasks: [...(existing.tasks || []), ...uniqueNewTasks],
									pages,
									total,
									page,
									limit,
							  }
							: folder
					)
				}

				return [
					...prev,
					{
						id,
						name,
						userId,
						tasks,
						pages,
						total,
						page,
						limit,
					},
				]
			})
		},
		[id, name, userId, setFoldersWithTasks]
	)

	const fetchTasks = useCallback(
		async (page: number) => {
			try {
				setTaskLoading(true)

				const { data } = await TasksService.getTasks({
					page,
					limit: TASK_FETCH_LIMIT,
					folderId: id,
				})

				updateFoldersWithTasks(data)

				setHasMore(page < data.pages)
			} catch (error) {
				console.error('[Folder] Fetch tasks error: ', error)
			} finally {
				setTaskLoading(false)
			}
		},
		[id, updateFoldersWithTasks]
	)

	const loadMoreTasks = () => {
		if (hasMore && !taskLoading) {
			const nextPage = tasks.length / TASK_FETCH_LIMIT + 1
			fetchTasks(Math.floor(nextPage))
		}
	}

	const handleShowTasks = () => {
		const willShow = !showTasks
		setShowTasks(willShow)

		if (willShow && hasMore && !taskLoading) {
			fetchTasks(1)
		}
	}

	const renderTaskContent = () => {
		if (!showTasks) return null

		if (tasks.length === 0 && taskLoading) {
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
			<TaskList
				folderId={id}
				tasks={tasks}
				hasMore={hasMore}
				loadMoreTasks={loadMoreTasks}
				taskLoading={taskLoading}
			/>
		)
	}

	return (
		<Card
			ref={setNodeRef}
			className={cn(
				'h-fit transition-colors duration-200',
				isOver ? 'bg-accent/80' : 'bg-background'
			)}>
			<CardHeader className='flex-row flex-wrap items-center justify-between gap-x-2 gap-y-1'>
				<CardTitle className='flex flex-col gap-1'>
					<p className='font-medium text-muted-foreground'>Folder name:</p>
					<p>{name}</p>
				</CardTitle>
				<div className='flex items-center gap-1'>
					<TooltipButton
						size='icon'
						variant='outline'
						label='Show tasks'
						onClick={handleShowTasks}>
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

			{renderTaskContent()}
		</Card>
	)
}

export default Folder
