import express from 'express';
var connection = require('../config/db_config.js').connection;

const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works!!!');
});

/**
 * GET consulta banco de dados
 */
router.get('/municipios', async (req, res) => {  
  
  execSQLQuery("SELECT * FROM municipio", res);        
  
});

function execSQLQuery(sqlQuery, res){

  connection.query(sqlQuery, function(error, results, fields){
      if(error) {
        res.status(400).json(error);
      } else {
        res.status(200).json(results);
      }

      connection.on('error', function(error) {
        console.log("[mysql error]", error);
      });

      connection.end();
  });
}

module.exports = router;