import express from 'express';
var pool = require('../config/db_config.js');

const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works!!!');
});

/**
 * GET consulta banco de dados
 */
router.get('/municipios', async (req, res) => {  
  var cod_ibge = "2504009";
  var query = "SELECT * FROM municipio WHERE cd_IBGE = " + pool.escape(cod_ibge);
  execSQLQuery(query, res);        
  
});

  function execSQLQuery(sqlQuery, res){

    pool.getConnection(function(err, connection) {
      
      connection.query(sqlQuery, function (error, results, fields) {
        
        if(error) {
          res.status(400).json(error);
        } else {
          res.status(200).json(results);
        }

        connection.release();            
            
      });
    });

}

module.exports = router;