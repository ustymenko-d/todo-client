import { ReactNode } from 'react'

const PageSection = ({ children }: { children: ReactNode }) => (
	<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow px-3 py-4 sm:px-4 xl:p-6'>
		{children}
	</section>
)

export default PageSection
