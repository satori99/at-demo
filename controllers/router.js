/** controllers/router.js */

import express from 'express'

import home from './home.js'
import about from './about.js'
import accessibility from './accessibility.js'
import article from './article.js'
import articles from './articles.js'
import subscribe from './subscribe.js'
import contact from './contact.js'
import devices from './devices.js'
import device from './device.js'

import Article from '../models/article.js'

const router = express.Router()

router.use( ( req, res, next ) => {

  res.locals.req = req

  res.locals.mainNavigation = {
    '/about'         : { name: 'About Us' },
    '/accessibility' : { name: 'Accessibility' },
    '/article'       : { name: 'Articles of Interest' },
    '/subscribe'     : { name: 'Subscribe' },
    '/contact'       : { name: 'Contact' },
  }

  res.locals.breadcrumbs = [
    { name: 'Home', href: '/' },
  ]

  next()

} )

router.get( '/', home )

router.get( '/about', about )

router.get( '/accessibility', accessibility )

router.get( '/article', articles )

router.param( 'articleId', ( req, res, next, articleId ) => {

  let db

  try {

    db = Article.openDatabase()

    //req.article = Article.find( { id: articleId, alias: articleId } )

    req.article = { id: 0, alias: 'test-article', name: 'My Article', content: 'yay!' }

  } catch ( err ) {

    return next( err )

  } finally {

    db.close()

  }

  next()

} )

router.get( '/article/:articleId', article )

router.get( '/device', devices )

router.param( 'deviceType', ( req, res, next, deviceType ) => {

  // todo: check type...for now just set it to req
  req.deviceType = deviceType

  next()

} )

router.get( '/device/:deviceType', devices )

router.get( '/device/:deviceType/:deviceId', device )

router.get( '/subscribe', subscribe )

router.get( '/contact', contact )

export default router

/* EOF */