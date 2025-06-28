import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface IPageHeadProps extends HTMLAttributes<HTMLDivElement> {
	title: string
	description?: string
}

const PageHead = ({ title, description, className }: IPageHeadProps) => (
	<div className={cn('flex flex-col gap-1', className)}>
		<h1 className='text-xl font-semibold tracking-tight'>{title}</h1>
		{description && (
			<p className='text-base text-muted-foreground'>{description}</p>
		)}
	</div>
)

export default PageHead
