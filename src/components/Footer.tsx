import { FC } from 'react'
import FooterLink from './ui/FooterLink'

const Footer: FC = () => {
	return (
		<footer className='container mx-auto py-4 px-2 text-center text-balance flex flex-wrap gap-x-1'>
			<p>
				Built&nbsp;by{' '}
				<FooterLink
					title='Denys Ustymenko'
					href='https://ustymenko.vercel.app/'
				/>
				.
			</p>
		</footer>
	)
}

export default Footer
