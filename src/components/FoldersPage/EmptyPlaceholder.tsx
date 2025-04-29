import { Button } from '@/components/ui/button'
import useAppStore from '@/store/store'
import { Plus } from 'lucide-react'

const EmptyPlaceholder = () => {
	const openEditor = useAppStore((state) => state.openFolderEditor)

	return (
		<div className='mt-4 w-full min-h-40 flex flex-col gap-3 items-center justify-center border rounded-md'>
			<h2>You haven&apos;t created any folders yet</h2>
			<Button
				variant='outline'
				onClick={() => openEditor('create', null)}>
				<Plus className='opacity-60' />
				Create folder
			</Button>
		</div>
	)
}

export default EmptyPlaceholder
