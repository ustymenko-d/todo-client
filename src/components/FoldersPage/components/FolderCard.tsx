import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteDialog from '@/components/DeleteDialog'
import { Loader2, PenLine, Trash2 } from 'lucide-react'
import { IFolder } from '@/types/folders'
import { Label } from '@/components/ui/label'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

const FolderCard = ({
	folder,
	isLoading,
	onEdit,
	onDelete,
}: {
	folder: IFolder
	isLoading: boolean
	onEdit: () => void
	onDelete: () => void
}) => {
	const [openAlert, setOpenAlert] = useState<boolean>(false)

	return (
		<Card>
			<CardHeader className='flex-row flex-wrap items-center justify-between gap-4'>
				<CardTitle className='flex flex-col gap-2'>
					<Label className='text-muted-foreground'>Folder name:</Label>
					{folder.name}
				</CardTitle>
				<div className='flex gap-2 items-center'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size='icon'
									variant='outline'
									onClick={onEdit}>
									<PenLine />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Rename</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size='icon'
									variant='destructive'
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
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Delete</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<DeleteDialog
						handleDelete={onDelete}
						loading={isLoading}
						deleteTarget='folder'
						open={openAlert}
						onOpenChange={setOpenAlert}
					/>
				</div>
			</CardHeader>
		</Card>
	)
}

export default FolderCard
