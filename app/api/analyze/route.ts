import { NextResponse } from 'next/server';
import { getHumeAccessToken } from '@/utils/getHumeAccessToken';

export async function POST(request: Request) {
  try {
    const accessToken = await getHumeAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const body = await request.json();
    
    // If this is a start request, return the access token
    if (body.type === 'start') {
      return NextResponse.json({ accessToken });
    }

    // Handle file upload for batch processing
    const formData = await request.formData();
    const file = formData.get('files') as File;
    const models = formData.get('models') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create a new FormData for the Hume API request
    const humeFormData = new FormData();
    humeFormData.append('files', file);
    humeFormData.append('models', models);

    // Submit to Hume's Batch API
    const response = await fetch('https://api.hume.ai/v0/batch/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: humeFormData,
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Hume API');
    }

    const data = await response.json();
    return NextResponse.json({ jobId: data.job_id });
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 