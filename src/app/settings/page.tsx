import PageSection from '@/components/ui/PageSection'
import Body from '@/components/SettingsPage/Body'

const SettingsPage = () => (
	<PageSection>
		<div className='flex flex-col'>
			<h1 className='text-xl font-semibold tracking-tight'>
				View and update your account settings
			</h1>
		</div>
		<Body />
	</PageSection>
)

export default SettingsPage
