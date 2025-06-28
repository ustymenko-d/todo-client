'use client'

import { ReactNode } from 'react'

import buildProvidersTree from '@/utils/buildProvidersTree'

import QueryProvider from './Query.provider'
import SocketProvider from './Socket.provider'
import ThemeProvider from './Theme.provider'
import ZustandProvider from './Zustand.provider'

const Tree = buildProvidersTree([
	[ZustandProvider],
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

const ProvidersTree = ({ children }: { children: ReactNode }) => (
	<Tree>{children}</Tree>
)

export default ProvidersTree
