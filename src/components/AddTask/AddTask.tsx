'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import TasksService from '@/services/api/tasks'
import { TaskBaseDto } from '@/dto/tasks'
import { toast } from 'sonner'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import TaskForm from './compoonents/TaskForm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const AddTask = () => {
	const router = useRouter()
	const pathname = usePathname()
	const [open, setOpen] = useState<boolean>(false)

	const handleClose = () => {
		setOpen(false)
	}

	const handleCreateTask = async (payload: TaskBaseDto) => {
		try {
			const { success, error, message } = await TasksService.createTask(payload)

			if (success) {
				toast.success('Task successfully created')
				handleClose()
				if (pathname === '/dashboard') router.push(`?page=1&limit=5`)
			}

			if (error) toast.error(message)
		} catch (error) {
			toast.error('Something went wrong!')
			console.error(`Error while creating a task: ${error}`)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					<span>Add task</span>
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Create new task</DialogTitle>
					<DialogDescription>* indicates required fields</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<TaskForm handleCreateTask={handleCreateTask} />
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default AddTask
