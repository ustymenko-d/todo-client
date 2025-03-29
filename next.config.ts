import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// reactStrictMode: false,
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{
						key: 'Access-Control-Allow-Origin',
						value: 'https://uptodo-client.vercel.app',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'X-Requested-With, Content-Type, Authorization',
					},
					{ key: 'Access-Control-Expose-Headers', value: 'Set-Cookie' },
				],
			},
		]
	},
}

export default nextConfig
