'use client'

import TasksService from '@/services/tasks.service'
import { TGetTasksRequest } from '@/types/tasks'
import { useQuery } from '@tanstack/react-query'

const useFetch = ({ limit, page, title, topLayerTasks }: TGetTasksRequest) =>
	useQuery({
		queryKey: ['tasks', { page, limit, title, topLayerTasks }],
		queryFn: () =>
			TasksService.getTasks({
				page,
				limit,
				title,
				topLayerTasks,
			}).then((res) => res.data),
	})

export default useFetch
