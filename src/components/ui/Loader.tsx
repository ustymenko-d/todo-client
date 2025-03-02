import { Loader2 } from 'lucide-react'

const Loader = () => {
	return (
		<div className='flex items-center gap-2'>
			<Loader2 className='animate-spin' />
			<span>Loading...</span>
		</div>
	)
}

export default Loader
