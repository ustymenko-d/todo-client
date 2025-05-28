import useFetch from '@/hooks/folders/useFetch'
import { formatValue } from '@/utils/formatting'

const FolderCell = ({ id }: { id: string }) => {
	const { data } = useFetch({ page: 1, limit: 25 })
	const folder = data?.folders?.find((folder) => folder.id === id)
	const formatedValue = formatValue(folder?.name)

	return <>{formatedValue}</>
}

export default FolderCell
