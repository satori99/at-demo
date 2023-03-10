/** server worker process */

import cluster from 'node:cluster'

import app from '../app.js'

if ( ! cluster.isWorker ) {
  console.error( 'this process (%d) is not a cluster worker!', process.pid )
  process.exit( 1 )
}

process.on( 'message', ( { __package } ) => app.locals.package ??= __package )

app.locals.worker = cluster.worker

const server = app.listen(
    process.env.NODE_PORT,
    process.env.NODE_IP,
    () => process.on( 'SIGINT', () => server.close( err => process.exit( 0 ) ) )
    ).once( 'error', err => process.exit( err.errno ) )

/* EOF */