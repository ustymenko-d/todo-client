'use client'

import debounce from 'lodash.debounce'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useMemo, useTransition } from 'react'

import { Input } from '@/components/ui/input'
import useAppStore from '@/store/store'

const SearchInput = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()

	const searchTerm = useAppStore((s) => s.searchTerm)
	const setSearchTerm = useAppStore((s) => s.setSearchTerm)

	const handleSearchChange = useMemo(
		() =>
			debounce((value: string) => {
				startTransition(() => {
					const params = new URLSearchParams()
					if (value) {
						params.set('title', value)
						params.set('page', '1')
						params.set('topLayerTasks', 'false')
					} else {
						params.set('topLayerTasks', 'true')
					}
					router.push(`?${params.toString()}`, { scroll: false })
				})
			}, 1000),
		[router]
	)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchTerm(value)
		handleSearchChange(value)
	}

	useEffect(() => {
		setSearchTerm(searchParams.get('title') || '')
	}, [searchParams, setSearchTerm])

	useEffect(
		() => () => {
			handleSearchChange.cancel()
		},
		[handleSearchChange]
	)

	return (
		<div className='flex items-center gap-2 relative'>
			<Input
				className='max-w-sm pe-8'
				value={searchTerm}
				onChange={(e) => handleChange(e)}
				placeholder='Search by title...'
			/>
			{isPending && (
				<Loader2
					strokeWidth={1.25}
					className='absolute right-2 w-5 h-5 text-gray-500 animate-spin'
				/>
			)}
		</div>
	)
}

export default SearchInput
