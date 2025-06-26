const START_PAGES = ['/', '/auth', '/verification']

const isStartPage = (pathname: string): boolean =>
	START_PAGES.includes(pathname)

export default isStartPage
