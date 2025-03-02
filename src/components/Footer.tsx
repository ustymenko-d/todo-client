import { FC } from 'react'
import FooterLink from './ui/FooterLink'

const Footer: FC = () => {
	return (
		<footer className='border-t border-dashed'>
			<div className='container mx-auto sm:border-x border-dashed py-4 px-2 text-center text-balance flex flex-wrap gap-x-1'>
				<p>
					Built&nbsp;by{' '}
					<FooterLink
						title='Denys Ustymenko'
						href='https://ustymenko.vercel.app/'
					/>
					.
				</p>
			</div>
		</footer>
	)
}

export default Footer
