/** middleware/require-user.js */

import { debuglog } from 'node:util'

import { STATUS_CODES } from 'node:http'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  if ( ! req.session?.user ) {

    if ( !! res.locals.accessToken  && res.locals.accessToken in req.query ) {

      debug( 'login form request from address:', req.ip )

      return res.render( 'admin/login' )

    }

    debug( 'unauthorized access to user-only route from address:', req.ip )

    req.session = null

    res.statusCode = 404

    return next( new Error( STATUS_CODES[ res.statusCode ] ) )

  }

  next()

}

/* EOF */