import { useCrossTabAuthSync } from "@/hooks/useCrossTabZustandSync"

const ZustandProvider = ({ children }: { children: React.ReactNode }) => {
	useCrossTabAuthSync()

	return <>{children}</>
}

export default ZustandProvider
