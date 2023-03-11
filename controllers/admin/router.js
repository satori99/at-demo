/** controllers/admin/router.js */
import { debuglog } from 'node:util'
import { STATUS_CODES } from 'node:http'
import express from 'express'
import nocache from 'nocache'

// models
import User from '../../models/user.js'
import DeviceType from '../../models/device-type.js'
import Device from '../../models/device.js'
import Article from '../../models/article.js'

// middleware
//import sessionCookie from '../../middleware/session-cookie.js'
import requireUser from '../../middleware/require-user.js'
import requireAdmin from '../../middleware/require-admin.js'

// admin routes
import login from './login.js'
import logout from './logout.js'
import home from './home.js'
import users from './users.js'
import user from './user.js'
import devices from './devices.js'
import device from './device.js'
import articles from './articles.js'
import article from './article.js'

const debug = debuglog( 'at-demo:admin' )

const router = express.Router()

// don't cache any admin pages
router.use( nocache() )

// add some default locals for all admin routes
router.use( ( req, res, next ) => {

  res.locals.req = req

  res.locals.accessToken = process.env.ACCESS_TOKEN

  res.locals.breadcrumbs = [ { name: 'Home', href: '/admin' } ]

  next()

} )

// handle login requests
router.post( '/', login )

// require a valid user for all routes from here on.
router.use( requireUser )

// handle logout requests
router.get( '/logout', logout )

// home/dashboard
router.get( '/', home )

// users

router.param( 'userId', ( req, res, next, userId ) => {
  debug( 'fetching user %d ...', userId )
  const db = User.openDatabase()
  try {
    req.user = User.find( db, { id: userId, username: userId } )
  } finally {
    db.close()
  }
  debug( 'req.user:', req.user )
  if ( ! req.user ) return next( 'route' )
  next()
} )

router.get( '/user', users )

router.get( '/user/:userId', user )


// devices

router.param( 'deviceTypeId', ( req, res, next, deviceTypeId ) => {
  debug( 'fetching device type %s ...', deviceTypeId )
  const db = DeviceType.openDatabase()
  try {
    req.deviceType = DeviceType.find( db, { id: deviceTypeId, alias: deviceTypeId } )
  } finally {
    db.close()
  }
  debug( 'req.deviceType:', req.deviceType )
  if ( ! req.deviceType ) return next( 'route' )
  next()
} )

router.param( 'deviceId', ( req, res, next, deviceId ) => {
  debug( 'fetching device %s ...', deviceId )
  const db = Device.openDatabase()
  try {
    req.device = Device.find( db, { id: deviceId, alias: deviceId } )
  } finally {
    db.close()
  }
  debug( 'req.device:', req.device )
  if ( ! req.device ) return next( 'route' )
  next()
} )

router.get( '/device', devices )

router.get( '/device/:deviceId', device )

// articles

router.param( 'articleId', ( req, res, next, articleId ) => {
  debug( 'fetching device %s ...', articleId )
  const db = Article.openDatabase()
  try {
    req.article = Article.find( db, { id: articleId, alias: articleId } )
  } finally {
    db.close()
  }
  debug( 'req.article:', req.article )
  if ( ! req.article ) return next( 'route' )
  next()
} )

router.get( '/article', articles )

router.get( '/article/:articleId', article )

//

router.use( ( req, res, next ) => {

  res.status( 404 )

  res.end( STATUS_CODES[ res.statusCode ] )

} )

export default router

/* EOF */