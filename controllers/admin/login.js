/** controllers/admin/login.js */

import { debuglog } from 'node:util'
import express from 'express'
import bcrypt from 'bcrypt'

import User from '../../models/user.js'

const debug = debuglog( 'at-demo:admin' )

export default ( req, res, next ) => {

  if ( req.session.user ) return next()

  delete req.session.message

  express.urlencoded()( req, res, async () => {

    debug( 'login attempt from address:', req.ip, req.body )

    const db = User.openDatabase()
    let user
    try {
      user = User.find( db, { username: req.body.username, emailAddress: req.body.username } )
    } finally {
      db.close()
    }

    const isAuthenticated = await bcrypt.compare( req.body.password || '', user?.passwordHash || '' )

    if ( ! isAuthenticated ) {

      debug( 'failed login request from', req.ip )

      req.session.message = 'Login failed. Please check your credentials and try again.'

      return res.redirect( '/admin?' + res.locals.accessToken )

    }

    debug( 'login success:', JSON.stringify( user, null, 2 ) )

    req.session.user = user

    return res.redirect( '/admin' )

  } )

}

/* EOF */