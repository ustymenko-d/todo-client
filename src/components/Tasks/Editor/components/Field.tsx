import { ElementType } from 'react'
import { UseFormReturn } from 'react-hook-form'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { TTaskBase } from '@/types/tasks'

interface IFieldProps {
	taskForm: UseFormReturn<TTaskBase>
	name: keyof TTaskBase
	Component: ElementType
	placeholder: string
	className?: string
}

const Field = ({
	taskForm,
	name,
	Component,
	placeholder,
	className,
}: IFieldProps) => (
	<FormField
		control={taskForm.control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel className='text-muted-foreground'>
					{name.charAt(0).toUpperCase() + name.slice(1)}:
				</FormLabel>
				<FormControl>
					<Component
						{...field}
						placeholder={placeholder}
						value={field.value || ''}
						className={className}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
)

export default Field
