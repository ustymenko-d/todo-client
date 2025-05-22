'use client'

import useFetch from '@/hooks/tasks/useFetch'
import Loader from '../ui/Loader'
import EmptyPlaceholder from '@/components/TablePage/components/EmptyPlaceholder'
import Table from '@/components/TablePage/Table'
import { TGetTasksRequest } from '@/types/tasks'

const Body = (searchparams: TGetTasksRequest) => {
	const { data, isLoading, isFetching } = useFetch(searchparams)

	if (isLoading) return <Loader className='pt-4 text-lg' />

	if (!data) return <EmptyPlaceholder />

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
