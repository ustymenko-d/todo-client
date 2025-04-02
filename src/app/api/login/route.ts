import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
				credentials: 'include',
			}
		)
		
		const data = await res.json()
		const response = NextResponse.json(data, { status: res.status });
		const cookies = res.headers.get("set-cookie");
		if (cookies) {
      response.headers.set("set-cookie", cookies);
    }

		return response;
	} catch {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
