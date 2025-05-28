import { useDroppable } from '@dnd-kit/core'
import { useState } from 'react'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { IFolder } from '@/types/folders'

import FolderActions from './FolderActions'
import TaskList from './TaskList'

const Folder = ({ folder }: { folder: IFolder }) => {
	const [showTasks, setShowTasks] = useState(false)

	const { isOver, setNodeRef } = useDroppable({ id: folder.id })

	const handleShowTasks = () => setShowTasks((prev) => !prev)

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
					handleShowTasks={handleShowTasks}
				/>
			</CardHeader>

			{showTasks && <TaskList {...folder} />}
		</Card>
	)
}

export default Folder
