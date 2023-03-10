/** controllers/subscribe.js */

export default ( req, res, next ) => {

  res.locals.title = 'Subscribe'

  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  res.render( 'subscribe' )

}

/* EOF */