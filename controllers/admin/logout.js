/** controllers/admin/logout.js */

export default ( req, res, next ) => {

  // destroy the session cookie
  req.session.user = null

  // redirect to main site
  res.redirect( '/' )

}