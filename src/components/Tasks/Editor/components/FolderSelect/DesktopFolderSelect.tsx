'use client'

import { FormControl } from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import useFetch from '@/hooks/folders/useFetch'

import { IFolderSelectProps } from '../EditorForm'

const DesktopFolderSelect = ({ field }: IFolderSelectProps) => {
	const { data } = useFetch({
		page: 1,
		limit: 25,
	})

	const { folders } = data ?? {}

	const handleChange = (value: string) => {
		field.onChange(value === 'null' ? null : value)
	}

	return (
		<Select
			onValueChange={handleChange}
			defaultValue={field.value ?? 'null'}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder='Select your folder' />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				<SelectItem value='null'>No Folder</SelectItem>

				{folders?.map(folder => (
					<SelectItem
						key={folder.id}
						value={folder.id}>
						{folder.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default DesktopFolderSelect
