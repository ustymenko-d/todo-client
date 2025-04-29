import useAppStore from '@/store/store'

const UnverifiedInfo = () => {
	const accountInfo = useAppStore((state) => state.accountInfo)

	return (
		<div className='flex flex-col gap-1'>
			<p className='text-base'>
				To verify your account, check the email specified during registration (
				{accountInfo?.email}). An unverified account will be deleted three days
				after registration.
			</p>
			<ul
				className='list-with-title text-muted-foreground list-disc'
				aria-label='Restrictions for unverified users:'>
				<li className='ml-5'>cannot create more than ten tasks</li>
				<li className='ml-5'>cannot create more than three folders</li>
			</ul>
		</div>
	)
}

export default UnverifiedInfo
