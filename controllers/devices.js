/** controllers/devices.js */

export default ( req, res, next ) => {

  res.locals.title = 'Device Search'

  if ( req.deviceType ) {

    res.locals.breadcrumbs.push( { name: res.locals.title, href: '/device' } )

    res.locals.breadcrumbs.push( { name: req.deviceType, active: true } )

  } else {

    res.locals.breadcrumbs.push( { name: res.locals.title, active: true } )

  }

  res.render( 'devices' )

}

/* EOF */