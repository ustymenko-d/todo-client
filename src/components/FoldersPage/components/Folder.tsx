import { useCallback, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteDialog from '@/components/DeleteDialog'
import TaskList from './TaskList'
import TooltipButton from './TooltipButton'
import { IFolder, IFolderWithTasks } from '@/types/folders'
import { ListTodo, Loader2, PenLine, Trash2 } from 'lucide-react'
import TasksService from '@/services/tasks.service'
import useAppStore from '@/store/store'
import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { TTask } from '@/types/tasks'

interface FolderCardProps {
	folder: IFolder
	isLoading: boolean
	onEdit: () => void
	onDelete: () => void
}

const LIMIT = 10

const Folder = ({ folder, isLoading, onEdit, onDelete }: FolderCardProps) => {
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const [openAlert, setOpenAlert] = useState(false)
	const [showTasks, setShowTasks] = useState(false)
	const [taskLoading, setTaskLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(1)

	const { isOver, setNodeRef } = useDroppable({ id: folder.id })

	const folderWithTasks = foldersWithTasks.find((f) => f.id === folder.id)
	const existingTasks = folderWithTasks?.tasks || []

	const updateFoldersWithTasks = useCallback(
		(newTasks: TTask[], currentPage: number, pages: number, total: number) => {
			setFoldersWithTasks((prev: IFolderWithTasks[]) => {
				const existing = prev.find((f) => f.id === folder.id)

				if (existing) {
					const uniqueNewTasks = newTasks.filter(
						(task) => !existing.tasks?.some((t) => t.id === task.id)
					)
					return prev.map((f) =>
						f.id === folder.id
							? {
									...f,
									tasks: [...(existing.tasks || []), ...uniqueNewTasks],
									pages,
									total,
									page: currentPage,
							  }
							: f
					)
				}

				return [
					...prev,
					{
						id: folder.id,
						name: folder.name,
						tasks: newTasks,
						pages,
						total,
						page: currentPage,
						limit: LIMIT,
					},
				]
			})
		},
		[folder.id, folder.name, setFoldersWithTasks]
	)

	const fetchTasks = useCallback(
		async (currentPage: number) => {
			try {
				setTaskLoading(true)

				const { data } = await TasksService.getTasks({
					page: currentPage,
					limit: LIMIT,
					folderId: folder.id,
				})
				const { tasks: newTasks, pages, total } = data

				updateFoldersWithTasks(newTasks, currentPage, pages, total)
				setHasMore(currentPage < pages)
			} catch (error) {
				console.error('[Folder] Fetch tasks error: ', error)
			} finally {
				setTaskLoading(false)
			}
		},
		[folder.id, updateFoldersWithTasks]
	)

	const loadMoreTasks = () => {
		if (hasMore && !taskLoading) {
			const nextPage = page + 1
			setPage(nextPage)
			fetchTasks(nextPage)
		}
	}

	const handleToggleTasks = () => {
		const willShow = !showTasks
		setShowTasks(willShow)

		if (willShow && hasMore && !taskLoading && existingTasks.length === 0) {
			fetchTasks(1)
		}
	}

	const renderTaskContent = () => {
		if (!showTasks) return null

		if (existingTasks.length === 0 && taskLoading) {
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
				folderId={folder.id}
				tasks={existingTasks}
				hasMore={hasMore}
				loadMoreTasks={loadMoreTasks}
				taskLoading={taskLoading}
			/>
		)
	}

	return (
		<Card
			ref={setNodeRef}
			className={clsx(
				'h-fit transition-colors duration-200',
				isOver ? 'bg-accent/80' : 'bg-background'
			)}>
			<CardHeader className='flex-row flex-wrap items-center justify-between gap-x-2 gap-y-1'>
				<CardTitle className='flex flex-col gap-1'>
					<p className='font-medium text-muted-foreground'>Folder name:</p>
					<p>{folder.name}</p>
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

			{renderTaskContent()}
		</Card>
	)
}

export default Folder
