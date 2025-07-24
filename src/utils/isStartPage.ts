const START_PAGES = ['/', '/auth', '/auth/reset-password', '/verification']

const isStartPage = (pathname: string): boolean => START_PAGES.includes(pathname)

export default isStartPage
