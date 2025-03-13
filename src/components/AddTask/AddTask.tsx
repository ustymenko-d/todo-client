'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import TaskForm from './compoonents/TaskForm'
import { useState } from 'react'

const AddTask = () => {
	const [open, setOpen] = useState(false)

	const handleClose = () => {
		setOpen(false)
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
					<TaskForm handleClose={handleClose} />
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default AddTask
