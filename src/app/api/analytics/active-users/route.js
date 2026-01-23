import { NextResponse } from 'next/server';
import { MOCK_ACTIVE_USERS } from '../mockData';
export async function GET(request) {
    try {
        const useDemoData = process.env.GA_USE_DEMO_DATA === 'true';
        if (useDemoData) {
            return NextResponse.json(MOCK_ACTIVE_USERS);
        }
        const propertyId = process.env.GA_PROPERTY_ID;
        const credentials = process.env.GA_CREDENTIALS;
        if (!propertyId || !credentials) {
            return NextResponse.json({
                error: 'Google Analytics not configured',
                message: 'Please set GA_PROPERTY_ID and GA_CREDENTIALS environment variables',
            }, { status: 500 });
        }
        let credentialsJson;
        try {
            credentialsJson = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'));
        }
        catch (parseError) {
            return NextResponse.json({
                error: 'Invalid credentials format',
                message: 'GA_CREDENTIALS must be base64 encoded JSON',
            }, { status: 500 });
        }
        const accessToken = await getAccessToken(credentialsJson);
        const activeUsersData = await fetchRealtimeData(propertyId, accessToken);
        return NextResponse.json(activeUsersData);
    }
    catch (error) {
        console.error('Error fetching real-time analytics data:', error);
        return NextResponse.json({
            error: 'Failed to fetch analytics',
            message: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
async function getAccessToken(credentials) {
    const scope = 'https://www.googleapis.com/auth/analytics.readonly';
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600;
    const header = {
        alg: 'RS256',
        typ: 'JWT',
    };
    const claimSet = {
        iss: credentials.client_email,
        scope,
        aud: credentials.token_uri || 'https://oauth2.googleapis.com/token',
        exp: expiry,
        iat: now,
    };
    const encoder = new TextEncoder();
    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const claimSetB64 = base64UrlEncode(JSON.stringify(claimSet));
    const signatureInput = `${headerB64}.${claimSetB64}`;
    const privateKey = await crypto.subtle.importKey('pkcs8', pemToArrayBuffer(credentials.private_key), {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
    }, false, ['sign']);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, encoder.encode(signatureInput));
    const signatureB64 = base64UrlEncode(signature);
    const jwt = `${signatureInput}.${signatureB64}`;
    const tokenResponse = await fetch(credentials.token_uri || 'https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });
    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Failed to get access token: ${errorText}`);
    }
    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}
async function fetchRealtimeData(propertyId, accessToken) {
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dimensions: [
                {
                    name: 'country',
                },
            ],
            metrics: [
                {
                    name: 'activeUsers',
                },
            ],
            orderBys: [
                {
                    metric: {
                        metricName: 'activeUsers',
                    },
                    desc: true,
                },
            ],
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GA4 real-time API request failed: ${errorText}`);
    }
    const data = await response.json();
    const allLocations = data.rows?.map((row) => ({
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
    })) || [];
    const totalActiveUsers = allLocations.reduce((sum, loc) => sum + loc.activeUsers, 0);
    const topLocations = allLocations.slice(0, 3);
    return {
        totalActiveUsers,
        locations: topLocations,
        timestamp: new Date().toISOString(),
    };
}
function pemToArrayBuffer(pem) {
    const pemContents = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s/g, '');
    const binary = atob(pemContents);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i);
    }
    return buffer;
}
function base64UrlEncode(data) {
    let base64;
    if (typeof data === 'string') {
        base64 = btoa(data);
    }
    else {
        const bytes = new Uint8Array(data);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        base64 = btoa(binary);
    }
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
//# sourceMappingURL=route.js.map