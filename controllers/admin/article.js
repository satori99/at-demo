/** controllers/admin/article.js */

import { debuglog } from 'node:util'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  res.locals.title = `${req.article.name}`

  res.locals.breadcrumbs.push( { name: 'Articles', href: '/admin/article' } )

  res.locals.breadcrumbs.push( { name: req.article.name, active: true } )

  res.render( 'admin/article' )

}

/* EOF */