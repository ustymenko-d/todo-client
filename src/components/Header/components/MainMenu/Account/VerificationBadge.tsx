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

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					{accountInfo?.isVerified ? (
						<BadgeCheck
							strokeWidth={1.25}
							size={20}
						/>
					) : (
						<BadgeAlert
							strokeWidth={1.25}
							size={20}
						/>
					)}
				</TooltipTrigger>
				<TooltipContent>
					<p>{accountInfo?.isVerified ? 'Verified' : 'Unverified'}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default VerificationBadge
