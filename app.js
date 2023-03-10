/**
 *
 * app.js - express.js application
 *
 */

import { debuglog } from 'node:util'

import express from 'express'
import logging from 'morgan'
import favicon from 'serve-favicon'
import compression from 'compression'

const debug = debuglog( 'at-demo:app' )

const app = express()

app.disable( 'X-Powered-By' )

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

app.get( '/', ( req, res, next ) => {

  res.send( app.locals.package )

} )

app.use( ( req, res, next ) => {

  res.status( 404 )

  // todo: send pretty "404 Not Found" page. But for now pass an error
  // to the error handler

  next( new Error( `${res.statusCode} - ${STATUS_CODES[res.statusCode]}` ) )

} )

app.use( ( err, req, res, next ) => {

    return next()

  //

} )

export default app


/* EOF */