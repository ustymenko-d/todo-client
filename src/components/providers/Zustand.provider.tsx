'use client'

import { ReactNode } from 'react'

import { useCrossTabAuthSync } from '@/hooks/useCrossTabZustandSync'

const ZustandProvider = ({ children }: { children: ReactNode }) => {
	useCrossTabAuthSync()

	return children
}

export default ZustandProvider
