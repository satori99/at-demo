/** models/article.js */

import { debuglog } from 'node:util'
import Model from './model.js'

const debug = debuglog( 'at-demo:model/article' )

export default class Article extends Model {

  static async init ( db ) {

    debug( 'initializing Article model ...' )

    db.exec( `CREATE TABLE IF NOT EXISTS article (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  alias           TEXT NOT NULL CHECK(alias != ''),
  name            TEXT NOT NULL CHECK(name != ''),
  data            TEXT NOT NULL CHECK(data != ''),
  createdBy       INTEGER NOT NULL,
  createdAt       DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastModifiedBy  INTEGER NOT NULL,
  lastModifiedAt  DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted         BOOL NOT NULL DEFAULT 0,
  FOREIGN KEY(createdBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY(lastModifiedBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);` )

  }

  static find ( db, {
    id    = null,
    alias = null,
  } = {} ) {
    const select = db.prepare( `SELECT * FROM article WHERE ( id = @id OR alias = @alias) AND deleted = 0;` )
    return select.get( { id, alias } )
  }

}

/* EOF */