const calculatePages = (total: number, limit = 10): number => {
	if (total < 0) throw new Error('Total must be a non-negative number')

	if (limit <= 0) throw new Error('Limit must be a positive number')

	return Math.ceil(total / limit)
}

export default calculatePages
