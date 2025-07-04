import { Loader2 } from 'lucide-react'
import { ComponentProps } from 'react'

import { Button } from './button'

interface ILoadingButtonProps extends ComponentProps<typeof Button> {
	loading: boolean
}

const LoadingButton = ({
	loading,
	children,
	disabled,
	...props
}: ILoadingButtonProps) => (
	<Button
		{...props}
		disabled={loading || disabled}>
		{loading ? (
			<>
				<Loader2
					strokeWidth={1.25}
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
