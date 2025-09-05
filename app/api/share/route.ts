import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const text = formData.get('text') as string;
    const url = formData.get('url') as string;
    const files = formData.getAll('audio') as File[];

    console.log('Shared content received:', {
      title,
      text,
      url,
      filesCount: files.length
    });

    // Procesar archivos compartidos si los hay
    const processedFiles = [];
    for (const file of files) {
      if (file.size > 0) {
        // En producción, aquí procesarías y guardarías los archivos
        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    }

    // Redirigir a la página principal con parámetros de contenido compartido
    const redirectUrl = new URL('/', request.url);
    
    if (title) redirectUrl.searchParams.set('shared_title', title);
    if (text) redirectUrl.searchParams.set('shared_text', text);
    if (url) redirectUrl.searchParams.set('shared_url', url);
    if (processedFiles.length > 0) {
      redirectUrl.searchParams.set('shared_files', JSON.stringify(processedFiles));
    }

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Error processing shared content:', error);
    
    // Redirigir a la página principal en caso de error
    return NextResponse.redirect(new URL('/', request.url).toString());
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('track');

  if (trackId) {
    // Redirigir a la página principal con el track específico
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('track', trackId);
    redirectUrl.searchParams.set('action', 'play');
    
    return NextResponse.redirect(redirectUrl.toString());
  }

  return NextResponse.redirect(new URL('/', request.url).toString());
}