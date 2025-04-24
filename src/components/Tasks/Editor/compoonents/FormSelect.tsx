import { ControllerRenderProps } from 'react-hook-form'
import useAppStore from '@/store/store'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { FormControl } from '@/components/ui/form'
import { TTaskPayload } from '@/types/tasks'

interface FormSelectProps {
	field: ControllerRenderProps<TTaskPayload, 'folderId'>
}

const FormSelect = ({ field }: FormSelectProps) => {
	const folders = useAppStore((state) => state.folders)

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

				{folders?.map((folder) => (
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

export default FormSelect
