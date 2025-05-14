import { ComponentType, FC, ReactNode } from 'react'

type ProviderProps = {
	children: ReactNode
	[key: string]: unknown
}

type ProviderComponent = ComponentType<ProviderProps>

type ProviderEntry = [ProviderComponent, Record<string, unknown>?]

const buildProvidersTree = (
	componentsWithProps: ProviderEntry[]
): FC<{ children: ReactNode }> => {
	const initialComponent: FC<{ children: ReactNode }> = ({ children }) => (
		<>{children}</>
	)

	return componentsWithProps.reduce(
		(AccumulatedComponents, [Provider, props = {}]) => {
			const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
				<AccumulatedComponents>
					<Provider {...props}>{children}</Provider>
				</AccumulatedComponents>
			)
			return Wrapper
		},
		initialComponent
	)
}

export default buildProvidersTree
