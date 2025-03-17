import { Checkbox } from '@/components/ui/checkbox'
import { FC } from 'react'
import { FormControl, FormField, FormItem } from './form'
import { Control } from 'react-hook-form'

interface RememberMeCheckboxProps {
	control: Control
}

const RememberMeCheckbox: FC<RememberMeCheckboxProps> = ({ control }) => {
	return (
		<FormField
			control={control}
			name='rememberMe'
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<div className='flex items-center space-x-2'>
							<label className='flex items-center gap-2 text-sm font-medium leading-none cursor-pointer text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
								<Checkbox
									{...field}
									checked={field.value}
									onCheckedChange={(checked: boolean) =>
										field.onChange(checked)
									}
								/>
								Remember me
							</label>
						</div>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}

export default RememberMeCheckbox
