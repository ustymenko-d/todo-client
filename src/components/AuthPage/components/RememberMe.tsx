import { Control } from 'react-hook-form'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

const RememberMe = ({ control }: { control: Control }) => (
	<FormField
		control={control}
		name='rememberMe'
		render={({ field }) => (
			<FormItem>
				<FormControl>
					<div className='flex items-center space-x-2'>
						<label className='flex items-center gap-2 text-base leading-none cursor-pointer text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
							<Checkbox
								{...field}
								checked={field.value}
								onCheckedChange={(checked: boolean) => field.onChange(checked)}
							/>
							Remember me
						</label>
					</div>
				</FormControl>
			</FormItem>
		)}
	/>
)

export default RememberMe
