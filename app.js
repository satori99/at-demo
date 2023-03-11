/**
 *
 * app.js - express.js application
 *
 */

import { debuglog } from 'node:util'
import { STATUS_CODES } from 'node:http'

import express from 'express'
import logging from 'morgan'
import favicon from 'serve-favicon'
import compression from 'compression'

import sessionCookie from './middleware/session-cookie.js'
//import requireUser from './middleware/require-user.js'

import router from './controllers/router.js'

import adminRouter from './controllers/admin/router.js'

const debug = debuglog( 'at-demo:app' )

const app = express()

app.disable( 'x-powered-by' )

app.set( 'trust proxy', 1 )

app.set( 'view engine', 'pug' )

app.set( 'json spaces', process.env.NODE_ENV === 'development' ? 2 : 0 )

app.locals.pretty = process.env.NODE_ENV === 'development'

app.use( ( req, res, next ) => {

  res.set( 'X-Worker-Id', app.locals.worker.id || '' )

  res.set( 'X-Worker-Pid', app.locals.worker.process.id || '' )

  next()

} )

app.use( logging( process.env.NODE_ENV === 'production' ? 'combined' : 'dev' ) )

app.use( favicon( 'public/favicon.ico' ) )

app.use( compression( { threshold: process.env.NODE_ENV === 'development' ? 0 : undefined } ) )

app.use( express.static( 'public', {

  // static content is immutable (no req  => 304 ) for the
  // cache period when in production mode.
  immutable: process.env.NODE_ENV === 'production',

  maxAge: 10 * 60 * 1000, // 10m

} ) )

app.use( express.static( 'node_modules/bootstrap/dist', {

  immutable: process.env.NODE_ENV === 'production',

  maxAge: 10 * 60 * 1000, // 10m

} ) )

app.use( router )

app.use( '/admin', sessionCookie, adminRouter )

app.use( ( req, res, next ) => {

  res.status( 404 )

  // todo: send pretty "404 Not Found" page. But for now pass an error
  // to the error handler

  next( new Error( `${res.statusCode} - ${STATUS_CODES[res.statusCode]}` ) )

} )

app.use( ( err, req, res, next ) => {

    if ( res.headersSent ) return next()

    if ( res.statusCode >= 400 ) {
      // a statusCode was already set, so lets assume the error message is
      // meaningful to users.
      res.locals.error = err

    } else {

      debug( 'unexpected error @ route %s', req.url, err )

      res.status( 500 )

      const message = `${res.statusCode} - ${STATUS_CODES[res.statusCode]}`

      res.locals.error = { message }

      if ( process.env.NODE_ENV === 'development' ) {

        res.locals.error.message += `\n\n${err.message}`

      }

    }

    res.render( 'error' )

} )

export default app


/* EOF */