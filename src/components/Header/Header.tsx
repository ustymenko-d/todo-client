import Actions from './components/Actions'

const Header = () => {
	return (
		<header className='sticky top-0 border-b border-dashed backdrop-blur'>
			<div className='container flex flex-wrap items-center px-2 mx-auto border-dashed lg:px-4 sm:border-x min-h-14 gap-x-2'>
				<Actions />
			</div>
		</header>
	)
}

export default Header
