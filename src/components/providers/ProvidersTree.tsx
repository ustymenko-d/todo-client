'use client'

import buildProvidersTree from '@/utils/buildProvidersTree'
import ZustandProvider from './ZustandProvider'
import SocketProvider from './SocketProvider'
import AuthProvider from './AuthProvider'
import ThemeProvider from './ThemeProvider'

const Tree = buildProvidersTree([
	[ZustandProvider],
	[SocketProvider],
	[AuthProvider],
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
