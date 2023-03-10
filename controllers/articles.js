/** controllers/articles.js */


export default ( req, res, next ) => {

  res.locals.title = 'Articles of Interest'
  
  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  res.render( 'articles' )

}

/* EOF */