'use client'

import { BadgeAlert, BadgeCheck } from 'lucide-react'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import useAccountInfo from '@/hooks/useAccountInfo'

const VerificationBadge = () => {
	const { data } = useAccountInfo()
	const tooltipText = data?.isVerified ? 'Verified' : 'Unverified'
	const BadgeIcon = data?.isVerified ? BadgeCheck : BadgeAlert

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
