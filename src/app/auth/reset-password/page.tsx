import ResetPasswordForm from '@/components/Auth/ResetPasswordForm'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

const ResetPasswordPage = () => {
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>Reset password</CardTitle>
					<CardDescription>Please enter a new password</CardDescription>
				</CardHeader>
				<CardContent>
					<ResetPasswordForm />
				</CardContent>
			</Card>
		</>
	)
}

export default ResetPasswordPage
