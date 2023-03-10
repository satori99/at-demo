/** controllers/admin/device.js */

import { debuglog } from 'node:util'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  res.locals.title = `Device: ${req.device.name}`

  res.locals.breadcrumbs.push( { name: 'Devices', href: '/admin/device' } )

  res.locals.breadcrumbs.push( { name: req.device.name, active: true } )

  res.render( 'admin/device' )

}

/* EOF */