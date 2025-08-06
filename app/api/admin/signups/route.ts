import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check (you can make this more secure)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const signups = await prisma.signup.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const totalCount = await prisma.signup.count()

    return NextResponse.json({
      signups,
      totalCount,
      message: `Found ${totalCount} signups`
    })

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch signups' },
      { status: 500 }
    )
  }
}
