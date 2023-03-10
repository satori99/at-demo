/** controllers/accessibility.js */
import { readFile } from 'node:fs/promises'
import { marked } from 'marked'

export default ( req, res, next ) => {

  res.locals.title = 'Accessibility'
  
  res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  readFile( 'public/doc/accessibility.md', 'utf-8' ).then( text => {

    res.locals.content = marked.parse( text )

    res.render( 'document' )

  } )

}

/* EOF */