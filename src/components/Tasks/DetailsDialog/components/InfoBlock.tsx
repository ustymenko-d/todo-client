import { PropsWithChildren } from 'react'

const InfoBlock = ({
	label,
	children,
}: PropsWithChildren<{
	label: string
}>) => (
	<div className='flex flex-col gap-1'>
		<h4 className='text-muted-foreground'>{label}</h4>
		{children}
	</div>
)

export default InfoBlock
