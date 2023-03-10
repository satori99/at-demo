/** controllers/admin/home.js */

export default ( req, res, next ) => {

  res.locals.title = 'Home'

  res.render( 'admin/home' )

}

/* EOF */