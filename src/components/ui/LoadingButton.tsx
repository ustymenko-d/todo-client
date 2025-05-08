import { Button } from './button'
import { Loader2 } from 'lucide-react'

const LoadingButton = ({
	loading,
	children,
	disabled,
	...props
}: {
	loading: boolean
} & React.ComponentProps<typeof Button>) => (
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
