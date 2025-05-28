'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import TasksService from '@/services/tasks.service'
import { IGetTasksResponse, TGetTasksRequest } from '@/types/tasks'

const useInfiniteFetch = (params: Omit<TGetTasksRequest, 'page'>) =>
	useInfiniteQuery<IGetTasksResponse, Error>({
		queryKey: ['tasks', params],
		queryFn: (context) =>
			TasksService.getTasks({
				...params,
				page: (context.pageParam as number) ?? 1,
			}).then((res) => res.data),
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = allPages.length + 1
			return nextPage <= lastPage.pages ? nextPage : undefined
		},
		staleTime: 1000 * 60 * 30,
		placeholderData: (prev) => prev,
		initialPageParam: 1,
	})

export default useInfiniteFetch
