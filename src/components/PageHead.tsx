const PageHead = ({ subject }: { subject: 'tasks' | 'folders' }) => {
	return (
		<div className='flex flex-col'>
			<h1 className='text-xl font-semibold tracking-tight'>
				Manage and organize your {subject}
			</h1>
			<p className='text-base text-muted-foreground'>
				Here&apos;s a list of your {subject}:
			</p>
		</div>
	)
}

export default PageHead
