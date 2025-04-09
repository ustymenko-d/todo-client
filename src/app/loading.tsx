import { Loader2 } from 'lucide-react'

const RootLoading = () => {
	return (
		<div className='flex items-center justify-center'>
			<div className='flex items-center gap-2'>
				<Loader2
					strokeWidth={1.5}
					className='animate-spin'
				/>
				<p className='text-xl font-medium'>Loading...</p>
			</div>
		</div>
	)
}

export default RootLoading
