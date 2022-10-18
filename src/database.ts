const sql = require('mssql');
try {
    sql.connect('mssql://user:pass@10.73.80.4/Mantenimiento?encrypt=true');
    console.log('DB is connected');
} catch (err) {
    console.log(err)
}
export default sql;
