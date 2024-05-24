import { getStore } from "@netlify/blobs"

export default async (request, context) => {
  const store = getStore('ifieldnotes')
  const id = context.id

  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins or specify a particular origin
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
    'mode': 'no-cors'
  };

  // if (request.method === 'OPTIONS') {
  //   // Handle CORS preflight request
  //   return new Response(null, { status: 204, headers });
  // }

  if (request.method === 'POST') {
    try {
      const body = await request.text()
      await store.set(id, body)
      return new Response('HTML fragment stored', { status: 200 })
    } catch (error) {
      console.error(error)
      return new Response(JSON.stringify({ error: 'Failed to store HTML fragment' }), { status: 500 })
    }
  } else if (request.method === 'GET') {
    try {
      const fragment = await store.get(id)
      if (fragment) {
        return new Response(fragment, { status: 200, headers: { 'Content-Type': 'text/html' } })
      } else {
        return new Response(JSON.stringify({ error: 'Fragment not found' }), { status: 404 })
      }
    } catch (error) {
      console.error(error)
      return new Response(JSON.stringify({ error: 'Failed to retrieve HTML fragment' }), { status: 500 })
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 })
  }
}



// import { getStore } from "@netlify/blobs"

// export default async (request, context) => {
//   try {
//     const construction = getStore('fieldnotes')
//     await construction.set(request.fieldnotesId, request.article)
  
//     return new Response('Article stored')
//   } catch (error) {
//     console.log(error)
//     return Response.json({ error: 'Failed converting article to blob' }, { status: 500 })
//   }
// }