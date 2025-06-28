import RefreshButton from '@/components/ui/RefreshButton'
import { IRefreshButtonProps } from '@/types/common'

const ErrorPlaceholder = ({ handleRefresh }: IRefreshButtonProps) => (
	<div className='pt-4'>
		<p className='mb-2'>
			Failed to upload data, try again:
		</p>

		<RefreshButton handleRefresh={handleRefresh} />
	</div>
)

export default ErrorPlaceholder
