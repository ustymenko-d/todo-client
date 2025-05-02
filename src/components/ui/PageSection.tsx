import React from 'react'

const PageSection = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => (
	<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
		{children}
	</section>
)

export default PageSection
