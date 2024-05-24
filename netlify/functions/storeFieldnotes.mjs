import { getStore } from "@netlify/blobs"

export default async (request, context) => {
  const store = getStore('ifieldnotes')
  const id = context.id

  if (request.method === 'POST') {
    try {
      // Create a Blob from the HTML string
      const blob = new Blob([request.body], { type: 'text/html' })
      console.log(blob)
      console.log(blob.type)
      await store.set(id, blob)
      return new Response('Article stored', { status: 200 })
    } catch (e) {
      console.log(e)
      return new Response(JSON.stringify({ e: 'Failed to store article' }), { status: 500 })
    }
  } else if (request.method === 'GET') {
    try {
      const article = await store.get(id)
      if (article) {
        return new Response(article, { status: 200, headers: { 'Content-Type': 'text/html' } })
      } else {
        return new Response(JSON.stringify({ e: 'article not found' }), { status: 404 })
      }
    } catch (e) {
      console.log(e)
      return new Response(JSON.stringify({ e: 'Failed to retrieve article' }), { status: 500 })
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