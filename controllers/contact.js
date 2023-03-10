/** controllers/contact.js */

export default ( req, res, next ) => {

  res.locals.title = 'Contact Us'

  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  res.render( 'contact' )

}

/* EOF */