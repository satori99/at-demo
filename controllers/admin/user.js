/** controllers/admin/user.js */

import { debuglog } from 'node:util'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  res.locals.title = `User: ${req.user.username}`

  res.locals.breadcrumbs.push( { name: 'Users', href: '/admin/user' } )

  res.locals.breadcrumbs.push( { name: req.user.username, active: true } )

  res.render( 'admin/user' )

}

/* EOF */