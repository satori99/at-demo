/** models/device.js */

import { debuglog } from 'node:util'
import Model from './model.js'

const debug = debuglog( 'at-demo:model/device' )

export default class Device extends Model {

  static async init ( db ) {

    debug( 'initializing Device model ...' )

    db.exec( `CREATE TABLE IF NOT EXISTS device (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  alias           TEXT NOT NULL CHECK(alias != '') UNIQUE,
  name            TEXT NOT NULL CHECK(name != '') UNIQUE,
  createdBy       INTEGER NOT NULL,
  createdAt       DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastModifiedBy  INTEGER NOT NULL,
  lastModifiedAt  DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(createdBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY(lastModifiedBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);` )

    return true

  }

}

/* EOF */