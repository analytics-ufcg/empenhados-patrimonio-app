import mysql from 'mysql';

var pool = mysql.createPool({
    host     : '150.165.15.81',
    user     : 'empenhados',
    port     : '3306',
    password : 'm15t3r10z05',
    database : 'eleicoes',
    charset: 'latin1'
})

module.exports = pool;
