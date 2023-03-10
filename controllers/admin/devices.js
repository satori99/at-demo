/** controllers/admin/devices.js */

import { debuglog } from 'node:util'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  debug( 'fetching devices list...' )

  res.locals.title = 'Devices'

  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  res.render( 'admin/devices' )

}

/* EOF */