'use client'

import useFetch from '@/hooks/tasks/useFetch'
import Loader from '../ui/Loader'
import EmptyPlaceholder from '@/components/TablePage/components/EmptyPlaceholder'
import Table from '@/components/TablePage/Table'
import { TGetTasksRequest } from '@/types/tasks'

const Body = (searchparams: TGetTasksRequest) => {
	const { data, isLoading } = useFetch(searchparams)

	if (isLoading) return <Loader />

	if (!data) return <EmptyPlaceholder />

	const { tasks, pages } = data

	return (
		<Table
			data={tasks}
			pagination={{ ...searchparams, pages }}
		/>
	)
}

export default Body
