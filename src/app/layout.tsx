import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

import Footer from '@/components/Footer'
import Header from '@/components/Header/Header'
import ProvidersTree from '@/components/providers/ProvidersTree'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	preload: false,
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	preload: false,
})

const title =
	process.env.NODE_ENV === 'development'
		? 'u-todo (development)'
		: 'u-todo'

export const metadata: Metadata = {
	title,
	description: 'u-todo is a task management application that helps you organize and manage your tasks efficiently.',
	creator: 'ustymenko.denys@gmail.com',
}

const RootLayout = ({
	children,
}: Readonly<{
	children: ReactNode
}>) => (
	<html lang='en'>
		<body
			className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}>
			<ProvidersTree>
				<Header />
				<main className='container flex flex-col items-center justify-center p-2 mx-auto border-dashed grow sm:border-x lg:p-4'>
					{children}
				</main>
				<Footer />
				<Toaster
					position='top-center'
					richColors
				/>
			</ProvidersTree>
		</body>
	</html>
)

export default RootLayout
