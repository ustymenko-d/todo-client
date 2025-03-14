import { Button } from '@/components/ui/button'

interface PaginationButtonProps {
	onClick: () => void
	disabled: boolean
	children: React.ReactNode
}

const PaginationButton = ({
	onClick,
	disabled,
	children,
}: PaginationButtonProps) => (
	<Button
		variant='outline'
		className='w-8 h-8 p-0'
		onClick={onClick}
		disabled={disabled}>
		{children}
	</Button>
)

export default PaginationButton
