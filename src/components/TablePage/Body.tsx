'use client'

import EmptyPlaceholder from '@/components/TablePage/components/Table/components/EmptyPlaceholder'
import Table from '@/components/TablePage/components/Table/Table'
import useFetch from '@/hooks/tasks/useFetch'
import { TGetTasksRequest } from '@/types/tasks'

import Loader from '../ui/Loader'

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
