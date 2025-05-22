'use client'

import TasksService from '@/services/tasks.service'
import { IGetTasksResponse, TGetTasksRequest } from '@/types/tasks'
import { useQuery } from '@tanstack/react-query'

const useFetch = (params: TGetTasksRequest) =>
	useQuery<
		IGetTasksResponse,
		Error,
		IGetTasksResponse,
		[string, TGetTasksRequest]
	>({
		queryKey: ['tasks', params],
		queryFn: () => TasksService.getTasks(params).then((res) => res.data),
		placeholderData: (previousData) => previousData,
		staleTime: 1000 * 60,
	})

export default useFetch
