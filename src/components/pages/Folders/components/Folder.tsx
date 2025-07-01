'use client'

import { useDroppable } from '@dnd-kit/core'
import { useState } from 'react'

import TasksInfiniteScroll from '@/components/Tasks/TasksInfiniteScroll'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { TASK_FETCH_LIMIT } from '@/const'
import { cn } from '@/lib/utils'
import { IFolder } from '@/types/folders'

import FolderActions from './FolderActions'

const Folder = ({ folder }: { folder: IFolder }) => {
	const { id, name } = folder

	const [showTasks, setShowTasks] = useState(false)

	const { isOver, setNodeRef } = useDroppable({ id })

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
					<p>{name}</p>
				</CardTitle>
				<FolderActions
					folder={folder}
					handleShowTasks={handleShowTasks}
				/>
			</CardHeader>

			{showTasks && (
				<TasksInfiniteScroll
					type='folder'
					fetchParams={{ folderId: id, limit: TASK_FETCH_LIMIT }}
					id={`scrollable-folder-${id}`}
					className='px-6 py-4 overflow-auto border-t max-h-60'
				/>
			)}
		</Card>
	)
}

export default Folder
