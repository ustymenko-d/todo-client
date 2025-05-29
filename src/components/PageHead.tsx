import { cn } from '@/lib/utils'

type PageHeadProps = {
	title: string
	description?: string
} & React.HTMLAttributes<HTMLDivElement>

const PageHead = ({ title, description, className }: PageHeadProps) => (
	<div className={cn('flex flex-col gap-1', className)}>
		<h1 className='text-xl font-semibold tracking-tight'>{title}</h1>
		{description && (
			<p className='text-base text-muted-foreground'>{description}</p>
		)}
	</div>
)

export default PageHead
