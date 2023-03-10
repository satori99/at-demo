#!/usr/bin/env node
/**
 *
 * Clustered HTTP Server Application
 *
 */

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'
import cluster from 'node:cluster'
import { debuglog, getSystemErrorName } from 'node:util'
import { availableParallelism, networkInterfaces } from 'node:os'
import { existsSync } from 'node:fs'
import { program, Option } from 'commander'
import Database from 'better-sqlite3'

import Metadata from '../models/metadata.js'
import User from '../models/user.js'
import Article from '../models/article.js'
import Device from '../models/device.js'

const __filename = fileURLToPath( import.meta.url )
const __dirname  = dirname( __filename )
const __package  = JSON.parse( readFileSync( join( __dirname, '../package.json' ) ) )

const debug = debuglog( 'at-demo:server' )

//

if ( ! cluster.isPrimary ) {
  console.error( 'this process (%d) is not a cluster primary!', process.pid )
  process.exit( 1 )
}

cluster.setupPrimary( {
  exec: join( __dirname, 'worker.js' ),
  cwd: join( __dirname, '..' ),
  args: [],
} )

//
// parse command line options
//

const options = ( await program
    .name( __package.name )
    .version( __package.version )
    .description( __package.description )
    .addOption(
        new Option(
          '-i, --bind-interface <address>',
          'bind interface address'
        )
        .default( process.env.NODE_IP || '::' )
    )
    .addOption(
        new Option(
          '-p, --bind-port <number>',
          'bind port number'
        )
        .default( process.env.NODE_PORT || 80 )
        .argParser( arg => parseInt( arg ) )
    )
    .addOption(
        new Option(
          '-w, --workers <number>',
          'number of worker processes'
        )
        .default( process.env.NODE_WORKERS
            || availableParallelism() )
        .argParser( arg => parseInt( arg ) )
    )
    .addOption(
        new Option(
          '-e, --environment <name>',
          'runtime environment'
        )
        .choices( [ 'production', 'development' ] )
        .default( 'production' )
    )
    .parseAsync()
).opts()

debug( 'options:', options )

//
// Initialize the database
//

const filepath = join( __dirname, '../data', options.environment + '.sqlite' )

console.error( 'initializing database:', filepath )

if ( ! existsSync( filepath ) ) debug( 'creating new database file:', filepath )

const db = new Database( filepath, { fileMustExist: false, verbose: debug } )

try {

  // make sure WAL is set for this database
  db.pragma( 'journal_mode = WAL' )

  await db.transaction( async () => {

    Metadata.init( db )
    console.error( ' ✅ metadata model initialized' )

    await User.init( db )
    console.error( ' ✅ user model initialized' )

    Article.init( db )
    console.error( ' ✅ article model initialized' )

    Device.init( db )
    console.error( ' ✅ device model initialized' )

  } )()

} finally { db.close() }

debug( db )

//
// create worker process environment
//

const env = {
  NODE_PORT  : options.bindPort,
  NODE_IP    : options.bindInterface,
  NODE_ENV   : options.environment,
  NODE_DB    : filepath,
  PWD        : join( __dirname, '..' ),
}

if ( options.environment === 'development' ) {
  const nodeDebug = ( process.env.NODE_DEBUG || '' ).split( ',' ).filter( s => s !== '' )
  nodeDebug.push( 'at-demo:*' )
  env.NODE_DEBUG = nodeDebug.join( ',' )
}

debug( 'worker env:', env )

//
// life-cycle event handlers
//

let isListening = false

process.on( 'exit', () => {
  const errorName = process.exitCode
      ? getSystemErrorName( process.exitCode - 256 )
      : ''
  debug( 'server has exited with code %d (%s)', process.exitCode, errorName )
  if ( process.exitCode ) {
    switch ( errorName ) {
      case 'EACCES':
        console.error( 'Error: EACCES',
            'You have insuffient privileges to run with the current options' )
        break
      case 'EADDRNOTAVAIL':
        console.error( 'Error: EADDRNOTAVAIL',
            'Failed to bind to the specified network adapters' )
        break
      default:
        console.error( 'Error:', errorName )
    }
    return
  }
  console.error( '%s server has closed', options.environment )
} )

cluster.on( 'exit', ( worker, code, signal ) => {
  debug( 'worker %d has exited with code %d (%s)',
      worker.id, code, code ? getSystemErrorName( code - 256 ) : '' )
  if ( isListening ) {
    debug( 'replacing worker process ...' )
    cluster.fork( env )
  } else {
    process.exitCode ||= code
  }
} )

cluster.on( 'listening', ( worker, address ) => {
  debug( 'worker %d (pid: %d) is listening', worker.id, worker.process.pid, address )
  // send package details to worker app
  worker.send( { __package } )
  // check if all workers are listening yet
  if ( ! isListening ) {
    isListening = Object.values( cluster.workers ).every( w => w.state === 'listening' )
    if ( isListening ) {
      // handle SIGINT (ctrl-c) to shutdown server
      process.once( 'SIGINT', () => {
        isListening = false
        console.error( '%s server is closing ...', options.environment )
      } )
      console.error( '%s server is listening', options.environment )
      // todo: print pretty url(s) to console
    }
  }
} )

//
// start worker processes
//

debug( 'forking %d workers...', options.workers )

for ( let i = 0; i < options.workers; i ++ ) {

  cluster.fork( env )

}

/* EOF */