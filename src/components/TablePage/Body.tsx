'use client'

import EmptyPlaceholder from '@/components/TablePage/components/Table/components/EmptyPlaceholder'
import Table from '@/components/TablePage/components/Table/Table'
import useFetch from '@/hooks/tasks/useFetch'
import { TGetTasksRequest } from '@/types/tasks'

import Loader from '../ui/Loader'

const Body = (searchparams: TGetTasksRequest) => {
	const { data, isLoading, isFetching, isError, refetch } =
		useFetch(searchparams)

	const handleRefetch = () => {
		if (isError) refetch()
	}

	if (isLoading) {
		return (
			<div className='flex flex-col items-center justify-center w-full gap-3 mt-4 border rounded-md min-h-40'>
				<Loader className='pt-4 text-lg' />
			</div>
		)
	}

	if (!data) return <EmptyPlaceholder handleRefresh={handleRefetch} />

	const { tasks, pages } = data

	return (
		<Table
			data={tasks}
			isFetching={isFetching}
			pagination={{ ...searchparams, pages }}
		/>
	)
}

export default Body
