import { Dialog } from '@/components/ui/dialog'
import AccountDialogContent from './components/AccountDialogContent'
import useAppStore from '@/store/store'

const AccountDialog = () => {
	const isOpen = useAppStore((state) => state.isOpenAccountDialog)
	const setIsOpen = useAppStore((state) => state.setIsOpenAccountDialog)

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<AccountDialogContent />
		</Dialog>
	)
}

export default AccountDialog
