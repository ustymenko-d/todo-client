import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import FolderActions from './FolderActions'
import TaskList from './TaskList'
import { IFolderWithTasks } from '@/types/folders'

const Folder = ({ folder }: { folder: IFolderWithTasks }) => {
	const { isOver, setNodeRef } = useDroppable({ id: folder.id })
	const [showTasks, setShowTasks] = useState(false)

	const handleShowTasks = () => {
		setShowTasks((prev) => !prev)
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
					<p>{folder.name}</p>
				</CardTitle>
				<FolderActions
					folder={folder}
					showTasks={handleShowTasks}
				/>
			</CardHeader>

		 <TaskList folder={folder} showTasks={showTasks} />
		</Card>
	)
}

export default Folder
