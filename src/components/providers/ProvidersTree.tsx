'use client'

import buildProvidersTree from '@/utils/buildProvidersTree'
import ZustandProvider from './Zustand.provider'
import QueryProvider from './Query.provider'
import SocketProvider from './Socket.provider'
import AuthProvider from './Auth.provider'
import FoldersProvider from './Folders.provider'
import ThemeProvider from './Theme.provider'

const Tree = buildProvidersTree([
	[ZustandProvider],
	[QueryProvider],
	[SocketProvider],
	[AuthProvider],
	[FoldersProvider],
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
