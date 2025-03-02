import { FC, ReactNode } from 'react'

interface HeaderProps {
	children?: ReactNode
}

const Header: FC<HeaderProps> = ({ children }) => {
	return (
		<header className='border-b border-dashed min-h-14'>
			<div className='container flex flex-wrap items-center px-2 mx-auto border-dashed sm:border-x min-h-14 gap-x-2'>
				{children}
			</div>
		</header>
	)
}

export default Header
