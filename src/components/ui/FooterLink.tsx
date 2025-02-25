import { FC } from 'react'
import Link from 'next/link'
import { buttonVariants } from './button'

interface FooterLinkProps {
	title: string
	href: string
}

const FooterLink: FC<FooterLinkProps> = ({ title, href }) => {
	return (
		<Link
			className={
				buttonVariants({
					variant: 'link',
					size: 'none',
				}) + ' underline'
			}
			href={href}>
			{title}
		</Link>
	)
}

export default FooterLink
