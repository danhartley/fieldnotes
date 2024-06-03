import { getStore } from "@netlify/blobs"

export default async (request, context) => {
  const store = getStore('ifieldnotes')
  const id = context.id

  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins or specify a particular origin
    'Access-Control-Allow-Headers': 'Content-Type, Context-ID',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  if (request.method === 'OPTIONS') {
    // Handle CORS preflight request
    return new Response(null, { status: 204, headers })
  }

  if (request.method === 'POST') {
    try {
      await store.set(id, request)
      return new Response('Article stored', { status: 200 })
    } catch (e) {
      console.log(e)
      return new Response(JSON.stringify({ e: 'Failed to store article', stack: e.stack }), { status: 500 })
    }
  } else if (request.method === 'GET') {
    try {
      const article = await store.get(id)
      if (article) {
        return new Response(article, { status: 200, headers: { 'Content-Type': 'text/html' } })
      } else {
        return new Response(JSON.stringify({ e: 'article not found', stack: e.stack, body: request.body }), { status: 404 })
      }
    } catch (e) {
      console.log(e)
      return new Response(JSON.stringify({ e: 'Failed to retrieve article', stack: e.stack }), { status: 500 })
    }
  } else {
    return new Response(JSON.stringify({ e: 'Method Not Allowed', stack: e.stack }), { status: 405 })
  }
}



// import { getStore } from "@netlify/blobs"

// export default async (request, context) => {
//   try {
//     const construction = getStore('fieldnotes')
//     await construction.set(request.fieldnotesId, request.article)
  
//     return new Response('Article stored')
//   } catch (e) {
//     console.log(e)
//     return Response.json({ e: 'Failed converting article to blob' }, { status: 500 })
//   }
// }