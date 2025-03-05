import { FC } from 'react'
import Link from 'next/link'
import { buttonVariants } from './ui/button'

const Footer: FC = () => {
	return (
		<footer className='border-t border-dashed'>
			<div className='container flex flex-wrap px-2 py-4 mx-auto text-center border-dashed sm:border-x lg:px-4 text-balance gap-x-1'>
				<p className='text-base'>
					Built&nbsp;by{' '}
					<Link
						className={buttonVariants({
							variant: 'link',
							size: 'none',
						})}
						href='https://ustymenko.vercel.app/'>
						Denys Ustymenko
					</Link>
					.
				</p>
			</div>
		</footer>
	)
}

export default Footer
