import mysql from 'mysql';

var config;
config = {
    connection : mysql.createConnection({
        host     : '150.165.85.32',
        user     : 'empenhados',
        port     : '3306',
        password : 'm15t3r10z05',
        database : 'utils'
    })
};

module.exports = config;

