'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import AuthService from '@/services/auth.service'
import { IUserInfo } from '@/types/auth'
import useIsStartPage from '@/utils/isStartPage'

const useAccountInfo = () => {
	const pathname = usePathname()

	return useQuery<IUserInfo>({
		queryKey: ['account info'],
		queryFn: () => AuthService.getAccountInfo().then((res) => res.data),
		placeholderData: (prev) => prev,
		staleTime: 1000 * 60 * 30,
		retry: false,
		enabled: !useIsStartPage(pathname),
	})
}

export default useAccountInfo
