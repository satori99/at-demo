/** middleware/require-admin.js */

import { debuglog } from 'node:util'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  if ( ! req.session.user?.admin ) {
    
    debug( 'unauthorized access to admin-only route from ip:', req.ip )

    return next( 'route' )
    
  }

  next()

}

/* EOF */