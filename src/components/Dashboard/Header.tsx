'use client'

import useAppStore from '@/store/store'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const Header = () => {
	const username = useAppStore((state) => state.userInfo?.username)
	const taskEditorSettings = useAppStore((state) => state.taskEditorSettings)
	const setTaskEditorSettings = useAppStore(
		(state) => state.setTaskEditorSettings
	)

	const openTaskEditor = () =>
		setTaskEditorSettings({ ...taskEditorSettings, open: true })

	return (
		<div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
			<div className='flex flex-col'>
				<h1 className='text-2xl font-bold tracking-tight'>
					{`Welcome back, ${username}!`}
				</h1>
				<p className='text-base text-muted-foreground'>
					Here&apos;s a list of your tasks
				</p>
			</div>

			<Button onClick={openTaskEditor}>
				<Plus />
				<span>Add task</span>
			</Button>
		</div>
	)
}

export default Header
