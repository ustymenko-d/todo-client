import Header from '@/components/Header'
import Loader from '@/components/ui/Loader'

const RootLoading = () => {
	return (
		<>
			<Header />
			<div className='container flex items-center justify-center px-2 py-8 mx-auto border-dashed grow sm:border-x'>
				<Loader />
			</div>
		</>
	)
}

export default RootLoading
