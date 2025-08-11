import { Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const Reminder = () => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size='icon'
					variant='outline'
					className='ms-auto'>
					<Info />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='end'
				className='max-w-80 w-fit sm:max-w-sm'>
				<div className='flex flex-col gap-1 text-sm w-fit text-balance sm:text-base'>
					<b>Please note:</b>
					<p>
						Since this is a demo app hosted on a free server, it may take a few seconds to respond
						on the first request due to cold start.
					</p>
					<p>Thank{'\u00A0'}you for your patience!</p>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default Reminder
