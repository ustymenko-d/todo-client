import { toast } from 'sonner'

import AuthAPI from '@/api/auth.api'

export const clearAuthCookies = async (autoReload: boolean = false) => {
	await AuthAPI.clearAuthCookies()

	const reloadPage = () => window.location.reload()
	const message = 'Authentication cookies have been cleared'

	if (autoReload) {
		toast.warning(`${message}. Reloading...`)
		setTimeout(reloadPage, 1500)
	} else {
		toast.warning(message, {
			description: 'Please reload the page to continue',
			action: {
				label: 'Reload',
				onClick: reloadPage,
			},
			duration: 10000,
		})
	}
}
