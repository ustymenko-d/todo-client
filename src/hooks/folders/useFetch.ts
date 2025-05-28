'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import FoldersService from '@/services/folders.service'
import { IGetFoldersRequest, IGetFoldersResponse } from '@/types/folders'
import useIsStartPage from '@/utils/isStartPage'

const useFetch = (params: IGetFoldersRequest) => {
	const pathname = usePathname()

	return useQuery<
		IGetFoldersResponse,
		Error,
		IGetFoldersResponse,
		[string, IGetFoldersRequest]
	>({
		queryKey: ['folders', params],
		queryFn: () => FoldersService.getFolders(params).then((res) => res.data),
		placeholderData: (prev) => prev,
		staleTime: 1000 * 60 * 30,
		retry: false,
		enabled:
			!useIsStartPage(pathname) ||
			pathname.startsWith('/settings') ||
			pathname.startsWith('/home'),
	})
}
export default useFetch
