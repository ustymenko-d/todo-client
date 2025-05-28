'use client'

import buildProvidersTree from '@/utils/buildProvidersTree'

import QueryProvider from './Query.provider'
import SocketProvider from './Socket.provider'
import ThemeProvider from './Theme.provider'

const Tree = buildProvidersTree([
	[QueryProvider],
	[SocketProvider],
	[
		ThemeProvider,
		{
			attribute: 'class',
			defaultTheme: 'system',
			enableSystem: true,
			disableTransitionOnChange: true,
		},
	],
])

const ProvidersTree = ({ children }: { children: React.ReactNode }) => (
	<Tree>{children}</Tree>
)

export default ProvidersTree
