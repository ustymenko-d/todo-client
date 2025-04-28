'use client'

import useAppStore from '@/store/store'
import { formatValue } from '@/utils/formatting'

const FolderCell = ({ id }: { id: string }) => {
	const folders = useAppStore((state) => state.accountInfo?.folders)
	const folder = folders?.find((f) => f.id === id)
	const formatedValue = formatValue(folder?.name)

	return <>{formatedValue}</>
}

export default FolderCell
