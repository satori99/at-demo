/** middleware/session-cookie.js */

import { randomBytes } from 'node:crypto'

import cookieSession  from 'cookie-session'

export default ( req, res, next ) => {

  cookieSession( {
    name: 'sid',
    keys: [ 'access123' ],
    path: '/admin',
    maxAge: 10 * 60 * 1000, // 10 minutes
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production'
  } )( req, res, () => {

    // make sure a random form token exists
    req.session.token ??= randomBytes( 32 ).toString( 'hex' )

    // make sure cookie is updated at least once a minute on page refreshes
    req.session.nowInMinutes = Math.floor( Date.now() / 60e3 )

    // make the session info available to views
    res.locals.session = req.session

    next()

  } )

}

/* EOF */