const formatDate = (dateString?: string): string => {
	if (!dateString) return '-'
	const date = new Date(dateString)
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
	})
}

export default formatDate
