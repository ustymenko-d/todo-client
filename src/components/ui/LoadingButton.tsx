import { FC, ReactNode } from 'react'
import { Button } from './button'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps {
	loading: boolean
	children: ReactNode
}

const LoadingButton: FC<
	LoadingButtonProps & React.ComponentProps<typeof Button>
> = ({ loading, children, ...props }) => (
	<Button
		{...props}
		disabled={loading}>
		{loading ? (
			<>
				<Loader2 className='animate-spin' />
				<span>Please wait</span>
			</>
		) : (
			children
		)}
	</Button>
)

export default LoadingButton
