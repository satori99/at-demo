/** models/model.js */

import { debuglog } from 'node:util'
import Database from 'better-sqlite3'

const debug = debuglog( 'at-demo:model' )

export default class Model {

  static openDatabase ( { readonly = true } = {} ) {

    return new Database( process.env.NODE_DB, {
      fileMustExist: true,
      verbose: debug,
      readonly,
    } )

  }

}

/* EOF */