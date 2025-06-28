import { Loader2 } from 'lucide-react'
import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface ILoaderProps extends HTMLAttributes<HTMLDivElement> {
	text?: string
}

const Loader = ({ text = 'Loading', className, ...props }: ILoaderProps) => (
	<div
		className={cn('flex items-center gap-2 text-muted-foreground', className)}
		{...props}>
		<Loader2
			strokeWidth={1.25}
			className='w-5 h-5 text-gray-500 animate-spin'
		/>
		<span>{text + '\u2026'}</span>
	</div>
)

export default Loader
