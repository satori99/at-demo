/** controllers/about.js */
import { readFile } from 'node:fs/promises'
import { marked } from 'marked'

export default ( req, res, next ) => {

  res.locals.title = 'About Us'

  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  readFile( 'public/doc/about.md', 'utf-8' ).then( text => {

    res.locals.content = marked.parse( text )

    res.render( 'document' )

  } )

}

/* EOF */