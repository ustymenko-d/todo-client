const PageSection = ({ children }: { children: React.ReactNode }) => (
	<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow px-2 py-4 sm:px-4'>
		{children}
	</section>
)

export default PageSection
