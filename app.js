/**
 *
 * app.js - express.js application
 *
 */

import { debuglog } from 'node:util'

import express from 'express'

const debug = debuglog( 'at-demo:app' )

const app = express()

export default app

/* EOF */