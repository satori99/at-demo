/** models/metadata.js */

import { debuglog } from 'node:util'
import Model from './model.js'

const debug = debuglog( 'at-demo:model/metadata' )

export default class Metadata extends Model {

  static async init ( db ) {

    debug( 'initializing Metadata model ...' )

    db.exec( `CREATE TABLE IF NOT EXISTS metadata (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL CHECK(name != '') UNIQUE,
  value TEXT NOT NULL CHECK(value != '')
);` )

    return true

  }

}

/* EOF */