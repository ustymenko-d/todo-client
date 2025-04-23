import { FC, ReactNode } from 'react'
import { Button } from './button'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps {
	loading: boolean
	children: ReactNode
	disabled?: boolean
}

const LoadingButton: FC<
	LoadingButtonProps & React.ComponentProps<typeof Button>
> = ({ loading, children, disabled, ...props }) => (
	<Button
		{...props}
		disabled={loading || disabled}>
		{loading ? (
			<>
				<Loader2
					strokeWidth={1.5}
					className='animate-spin'
				/>
				<span>Please wait</span>
			</>
		) : (
			children
		)}
	</Button>
)

export default LoadingButton
