import inatjs from "inaturalistjs"

const init = () => {

  console.log('inatjs: ', inatjs)

  inatjs.observations.search({ taxon_id: 4 }).then( rsp => {
    console.log(rsp)
  })
 }

 init()