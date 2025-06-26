'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import TasksAPI from '@/api/tasks.api'
import { IGetTasksResponse, TGetTasksRequest } from '@/types/tasks'
import useIsStartPage from '@/utils/isStartPage'

const useFetch = (params: TGetTasksRequest) => {
	const pathname = usePathname()

	return useQuery<
		IGetTasksResponse,
		Error,
		IGetTasksResponse,
		[string, TGetTasksRequest]
	>({
		queryKey: ['tasks', params],
		queryFn: () => TasksAPI.getTasks(params),
		placeholderData: (prev) => prev,
		staleTime: 1000 * 60 * 30,
		retry: false,
		enabled: !useIsStartPage(pathname),
	})
}

export default useFetch
