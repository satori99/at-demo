/** controllers/admin/users.js */

import { debuglog } from 'node:util'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  debug( 'fetching users list...' )

  res.locals.title = 'Users'
  
  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  res.render( 'admin/users' )

}

/* EOF */