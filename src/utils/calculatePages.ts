const calculatePages = (total: number, limit = 10) => Math.ceil(total / limit)

export default calculatePages
