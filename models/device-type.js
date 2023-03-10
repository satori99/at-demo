/** models/device.js */

import { debuglog } from 'node:util'
import Model from './model.js'

const debug = debuglog( 'at-demo:model/device' )

export default class DeviceType extends Model {

  static async init ( db ) {

    debug( 'initializing Device Type model ...' )

    db.exec( `CREATE TABLE IF NOT EXISTS deviceType (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  alias           TEXT NOT NULL CHECK(alias != '') UNIQUE,
  name            TEXT NOT NULL CHECK(name != '') UNIQUE,
  description     TEXT CHECK(name != ''),
  createdBy       INTEGER NOT NULL,
  createdAt       DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastModifiedBy  INTEGER NOT NULL,
  lastModifiedAt  DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted         BOOL NOT NULL DEFAULT 0,
  FOREIGN KEY(createdBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY(lastModifiedBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);` )

    const insert = db.prepare( `INSERT OR IGNORE INTO deviceType (
  id, alias, name, description, createdBy, lastModifiedBy
) VALUES
  ( 0, 'mobile', 'Mobile', NULL, 0, 0 ),
  ( 1, 'tablet', 'Tablet', NULL, 0, 0 ),
  ( 2, 'landline', 'Landline Telephone', NULL, 0, 0 ),
  ( 3, 'landline-cordless', 'Cordless Landline Telephone', NULL, 0, 0 )
;` )

    return insert.run()

  }

  static find ( db, {
    id    = null,
    alias = null,
  } = {} ) {
    const select = db.prepare( `SELECT * FROM deviceType WHERE ( id = @id OR alias = @alias) AND deleted = 0;` )
    return select.get( { id, alias } )
  }

}

/* EOF */