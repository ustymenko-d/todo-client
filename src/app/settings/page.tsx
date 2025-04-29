import Body from '@/components/SettingsPage/Body'
import Head from '@/components/SettingsPage/Head'

const SettingsPage = () => (
	<section className='w-full overflow-hidden rounded-[0.5rem] border bg-background shadow gap-3 grow p-2 sm:p-4 lg:p-8'>
		<Head />
		<Body />
	</section>
)

export default SettingsPage
