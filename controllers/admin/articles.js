/** controllers/admin/articles.js */

import { debuglog } from 'node:util'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  debug( 'fetching articles list...' )

  res.locals.title = 'Articles'

  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  res.render( 'admin/articles' )

}

/* EOF */