'use client'

import { useCrossTabZustandSync } from '@/hooks/useCrossTabZustandSync'

const ZustandProvider = ({ children }: { children: React.ReactNode }) => {
	useCrossTabZustandSync()

	return <>{children}</>
}

export default ZustandProvider
