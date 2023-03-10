/** controllers/home.js */

export default ( req, res, next ) => {

  res.locals.title = 'Home'

  res.render( 'home' )

}

/* EOF */