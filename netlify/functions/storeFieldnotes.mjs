import { getStore } from "@netlify/blobs"

export default async (request, context) => {
  const store = getStore('ifieldnotes')
  const id = context.id

  if (request.method === 'POST') {
    try {
      const body = await request.text()
      await store.set(id, body)
      return new Response('HTML fragment stored', { status: 200 })
    } catch (e) {
      console.log(e)
      return new Response(JSON.stringify({ e: 'Failed to store HTML fragment' }), { status: 500 })
    }
  } else if (request.method === 'GET') {
    try {
      const fragment = await store.get(id)
      if (fragment) {
        return new Response(fragment, { status: 200, headers: { 'Content-Type': 'text/html' } })
      } else {
        return new Response(JSON.stringify({ e: 'Fragment not found' }), { status: 404 })
      }
    } catch (e) {
      console.log(e)
      return new Response(JSON.stringify({ e: 'Failed to retrieve HTML fragment' }), { status: 500 })
    }
  } else {
    return new Response(JSON.stringify({ e: 'Method Not Allowed' }), { status: 405 })
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