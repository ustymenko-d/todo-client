const PageHead = ({
	title,
	description,
}: {
	title: string
	description?: string
}) => (
	<div className='flex flex-col'>
		<h1 className='text-xl font-semibold tracking-tight'>{title}</h1>
		{description && (
			<p className='text-base text-muted-foreground'>{description}</p>
		)}
	</div>
)

export default PageHead
