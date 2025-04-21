import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { TaskFormSchema } from '@/schemas/tasksSchema'
import { ElementType } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface IFieldProps {
	taskForm: UseFormReturn<TaskFormSchema>
	name: keyof TaskFormSchema
	placeholder: string
	Component: ElementType
}

const Field = ({ taskForm, name, Component, placeholder }: IFieldProps) => {
	const label = name.charAt(0).toUpperCase() + name.slice(1)
	
	return (
		<FormField
			control={taskForm.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Component
							{...field}
							placeholder={placeholder}
							value={field.value || ''}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default Field
