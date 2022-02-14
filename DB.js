class DB {
  constructor(name, version, title, size, callback) {
    this.db = openDatabase(name, version, title, size, callback);
  }

  query(sql, params) {
    var db = this.db;
    return new Promise(function (resolve, reject) {
      if (!db)
        return reject(new Error('Не удалось открыть БД'));
      db.transaction(function (tx) {
        tx.executeSql(sql, params || [], function (tx, res) {
          const rows = [];
          for (let i = 0; i < res.rows.length; i++) {
            rows.unshift(res.rows.item(i));
          }
          const out = {
            rows: rows,
            rowsAffected: res.rowsAffected
          };
          try { out.insertId = res.insertId; } catch (e) { }
          resolve(out);
        }, function (tx, err) {
          reject(err);
        });
      });
    });
  }
}
