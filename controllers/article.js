/** controllers/article.js */

import { STATUS_CODES } from 'node:http'

export default ( req, res, next ) => {

  console.error( 'req.article:', req.article )

  if ( ! req.article ) {

    res.status( 404 )

    return next( new Error( STATUS_CODES[ res.statusCode ] ) )

  }

  res.locals.title = 'Article:'

  res.locals.breadcrumbs.push( { name: 'Articles of Interest', href: '/article' } )

  res.locals.breadcrumbs.push( { name: req.article.name, active: true } )

  res.locals.article = req.article

  res.render( 'article' )

}

/* EOF */