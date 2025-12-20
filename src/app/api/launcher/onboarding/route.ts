import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await req.json()

    // Validate required fields
    if (!data.businessName || !data.businessType) {
      return NextResponse.json(
        { error: '상호명과 업종은 필수입니다.' },
        { status: 400 }
      )
    }

    // Generate slug from business name
    const slug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Create tenant
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        businessName: data.businessName,
        businessType: data.businessType,
        ownerName: data.ownerName || '',
        phone: data.phone || '',
        email: data.email || '',
        location: {
          address: data.address || '',
          addressDetail: data.addressDetail || '',
        },
        branding: {
          primaryColor: data.primaryColor || '#000000',
          secondaryColor: data.secondaryColor || '#666666',
          vibe: data.vibe || 'casual',
          slogan: data.slogan || '',
        },
        targetCustomer: data.targetCustomer || '',
        signatureMenu: data.signatureMenu || [],
        operation: {
          businessHours: data.businessHours || '',
          closedDays: data.closedDays || '',
        },
        features: {
          delivery: data.features?.delivery || false,
          reservation: data.features?.reservation || false,
          parking: data.features?.parking || false,
          wifi: data.features?.wifi || false,
          petFriendly: data.features?.petFriendly || false,
          kidsZone: data.features?.kidsZone || false,
        },
        careOn: {
          subscribed: data.careOnSubscribed === 'true' || data.careOnSubscribed === true,
          cctvCount: parseInt(data.cctvCount) || 0,
          posConnected: data.posConnected || false,
        },
        onboarding: {
          currentStep: 5,
          completedAt: new Date().toISOString(),
        },
        status: 'active',
        // TODO: Associate with authenticated user
        // user: req.user?.id,
      },
    })

    // Create default generated site
    const site = await payload.create({
      collection: 'generated-sites',
      data: {
        name: `${data.businessName} 웹사이트`,
        slug: `${slug}-${Date.now()}`,
        tenant: tenant.id,
        type: 'website',
        status: 'building',
        config: {
          branding: {
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            vibe: data.vibe,
            slogan: data.slogan,
          },
          menu: data.signatureMenu,
          features: data.features,
        },
      },
    })

    // TODO: Trigger site generation pipeline
    // await triggerSiteGeneration(site.id)

    return NextResponse.json({
      success: true,
      tenantId: tenant.id,
      siteId: site.id,
      slug: site.slug,
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: '사이트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
