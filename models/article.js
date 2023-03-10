/** models/article.js */

import { debuglog } from 'node:util'
import Model from './model.js'

const debug = debuglog( 'at-demo:model/article' )

export default class Article extends Model {

  static async init ( db ) {

    debug( 'initializing Article model ...' )

    db.exec( `CREATE TABLE IF NOT EXISTS article (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL CHECK(name != ''),
  data            TEXT NOT NULL CHECK(data != ''),
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