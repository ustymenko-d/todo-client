import { ElementType } from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { TTaskPayload } from '@/types/tasks'

interface IFieldProps {
	taskForm: UseFormReturn<TTaskPayload>
	name: keyof TTaskPayload
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
					<FormLabel className='text-muted-foreground'>{label}:</FormLabel>
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
