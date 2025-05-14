import AuthService from '@/services/auth.service'
import VerificationStatus from '@/components/VerificationPage/VerificationStatus'

interface VerificationPageProps {
	searchParams: Promise<{
		verificationToken: string
	}>
}

const VerificationPage = async ({ searchParams }: VerificationPageProps) => {
	const { verificationToken } = await searchParams
	const { data } = await AuthService.verifyEmail(verificationToken)
	const { message } = data

	return <VerificationStatus message={message} />
}

export default VerificationPage
