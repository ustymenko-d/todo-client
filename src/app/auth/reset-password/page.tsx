import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

const ResetPasswordPage = () => {
	return (
		<Card className='sm:min-w-80'>
			<CardHeader>
				<CardTitle className='text-2xl'>Change password</CardTitle>
				<CardDescription>Please enter a new password</CardDescription>
			</CardHeader>
			<CardContent>
				<ResetPasswordForm />
			</CardContent>
		</Card>
	)
}

export default ResetPasswordPage
