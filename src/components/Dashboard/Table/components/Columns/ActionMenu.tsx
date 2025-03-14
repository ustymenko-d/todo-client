import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { TaskDto } from '@/dto/tasks'

const ActionMenu = ({ task }: { task: TaskDto }) => (
	<DropdownMenu>
		<DropdownMenuTrigger
			asChild
			className='flex ml-auto'>
			<Button
				variant='ghost'
				className='h-8 w-8 p-0'>
				<span className='sr-only'>Open menu</span>
				<MoreHorizontal className='h-4 w-4' />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align='end'>
			<DropdownMenuItem>Edit</DropdownMenuItem>
			<DropdownMenuItem onClick={() => console.log(task.id)}>
				Toggle status
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem>Delete</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
)

export default ActionMenu