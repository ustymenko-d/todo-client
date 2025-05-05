import { useCallback, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteDialog from '@/components/DeleteDialog'
import TaskList from './TaskList'
import TooltipButton from './TooltipButton'
import { IFolder, IFolderWithTasks } from '@/types/folders'
import { ListTodo, Loader2, PenLine, Trash2 } from 'lucide-react'
import TasksService from '@/services/tasks.service'
import useAppStore from '@/store/store'

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

				console.log(data)

				setFoldersWithTasks((prev: IFolderWithTasks[]) => {
					const existing = prev.find((f) => f.id === folder.id)
					if (existing) {
						const existingTasks = existing.tasks || []

						const uniqueNewTasks = newTasks.filter(
							(task) => !existingTasks.some((t) => t.id === task.id)
						)

						return prev.map((f) =>
							f.id === folder.id
								? {
										...f,
										tasks: [...existingTasks, ...uniqueNewTasks],
										pages,
										total,
										page: currentPage,
								  }
								: f
						)
					} else {
						return [
							...prev,
							{
								id: folder.id,
								name: folder.name,
								pages,
								total,
								tasks: newTasks,
								page: currentPage,
								limit: LIMIT,
							},
						]
					}
				})
				setHasMore(currentPage < pages)
			} catch (error) {
				console.error('[Folder] Fetch tasks error: ', error)
			} finally {
				setTaskLoading(false)
			}
		},
		[folder.id, folder.name, setFoldersWithTasks]
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

		const folderWithTasks = foldersWithTasks.find((f) => f.id === folder.id)
		const alreadyHasTasks = (folderWithTasks?.tasks ?? []).length > 0

		if (hasMore && !taskLoading && !alreadyHasTasks) {
			fetchTasks(1)
		}
	}

	return (
		<Card className='h-fit'>
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

			{showTasks &&
				((foldersWithTasks.find((f) => f.id === folder.id)?.tasks ?? [])
					.length === 0 && taskLoading ? (
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
						tasks={
							foldersWithTasks.find((f) => f.id === folder.id)?.tasks || []
						}
						hasMore={hasMore}
						loadMoreTasks={loadMoreTasks}
						taskLoading={taskLoading}
					/>
				))}
		</Card>
	)
}

export default Folder
