import RefreshButton from '@/components/ui/RefreshButton'
import { IRefreshButtonProps } from '@/types/common'

const EmptyPlaceholder = ({ handleRefresh }: IRefreshButtonProps) => (
	<div className='flex flex-col items-center justify-center w-full gap-3 mt-4 border rounded-md min-h-40'>
		<h2>Failed to upload tasks</h2>
		<RefreshButton handleRefresh={handleRefresh} />
	</div>
)

export default EmptyPlaceholder
