const isStartPage = (pathname: string) =>
	pathname === '/' || pathname === '/auth'

export default isStartPage
