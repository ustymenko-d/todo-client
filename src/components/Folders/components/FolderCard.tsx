import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { IFolder } from '@/types/folders'
import { Loader2, PenLine, Trash2 } from 'lucide-react'

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
}) => (
	<Card>
		<CardHeader className='flex-row flex-wrap items-center justify-between gap-4'>
			<CardTitle>{folder.name}</CardTitle>
			<div className='flex gap-2 items-center'>
				<Button
					size='icon'
					variant='outline'
					onClick={onEdit}>
					<PenLine />
				</Button>
				<Button
					size='icon'
					variant='destructive'
					disabled={isLoading}
					onClick={onDelete}>
					{isLoading ? (
						<Loader2
							strokeWidth={1.5}
							className='animate-spin'
						/>
					) : (
						<Trash2 />
					)}
				</Button>
			</div>
		</CardHeader>
	</Card>
)

export default FolderCard
