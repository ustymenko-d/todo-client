'use client'

import { ReactNode } from 'react'

import buildProvidersTree from '@/utils/buildProvidersTree'

import QueryProvider from './Query.provider'
import ReCAPTCHAProvider from './ReCAPTCHA.provider'
import SocketProvider from './Socket.provider'
import ThemeProvider from './Theme.provider'
import ZustandProvider from './Zustand.provider'

const Tree = buildProvidersTree([
	[ZustandProvider],
	[QueryProvider],
	[SocketProvider],
	[ReCAPTCHAProvider],
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

const ProvidersTree = ({ children }: { children: ReactNode }) => <Tree>{children}</Tree>

export default ProvidersTree
