/** models/user.js */

import { debuglog } from 'node:util'
import bcrypt from 'bcrypt'
import Model from './model.js'

const debug = debuglog( 'at-demo:model/user' )

export default class User extends Model {

  static async init ( db ) {

    debug( 'initializing User model ...' )

    db.exec( `CREATE TABLE IF NOT EXISTS user (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  username        TEXT NOT NULL CHECK(username != ''),
  name            TEXT NOT NULL CHECK(name != ''),
  emailAddress    TEXT CHECK(emailAddress != ''),
  passwordHash    TEXT NOT NULL CHECK(passwordHash != ''),
  createdBy       INTEGER NOT NULL,
  createdAt       DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastModifiedBy  INTEGER NOT NULL,
  lastModifiedAt  DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active          BOOL NOT NULL DEFAULT 1,
  admin           BOOL NOT NULL DEFAULT 0,
  deleted         BOOL NOT NULL DEFAULT 0,
  UNIQUE(username, deleted),
  UNIQUE(emailAddress, deleted),
  FOREIGN KEY(createdBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY(lastModifiedBy) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);` )

    db.exec( `CREATE VIEW IF NOT EXISTS user_view
AS SELECT
  user.*,
  creator.username AS createdByUsername,
  modifier.username AS lastModifiedByUsername
FROM user
  INNER JOIN user AS creator ON user.createdBy = creator.id
  INNER JOIN user AS modifier ON user.lastModifiedBy = modifier.id
WHERE user.deleted = 0;` )

    const insert = db.prepare( `INSERT OR IGNORE INTO user (
  id, username, name, passwordHash, createdBy, lastModifiedBy, admin
) VALUES (
  0, 'admin', 'Administrator', ?, 0, 0, 1
);` )

    const passwordHash = await bcrypt.hash( 'password', 10 )

    return insert.run( passwordHash ).changes === 1

  }

}

/* EOF */