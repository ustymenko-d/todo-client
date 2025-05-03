import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import useAppStore from '@/store/store'
import { BadgeAlert, BadgeCheck } from 'lucide-react'

const VerificationBadge = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)
	const tooltipText = accountInfo?.isVerified ? 'Verified' : 'Unverified'
	const BadgeIcon = accountInfo?.isVerified ? BadgeCheck : BadgeAlert

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<BadgeIcon
						strokeWidth={1.25}
						size={20}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<p>{tooltipText}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default VerificationBadge
