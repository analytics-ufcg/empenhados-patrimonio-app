import express from 'express';
var pool = require('../config/db_config.js');
import { QueryService } from '../services/QueryService';

const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works!!!');
});

/**
 * GET retorna patrimonios considerando o estado, ano, cargo e situacao
 */
router.get('/patrimonio/:estado/:ano/:cargo/:situacao', async (req, res) => {    
  let parameters = await QueryService.recuperaParametrosPatrimonio(req);
  let query = await QueryService.recuperaConsultaPatrimonio(req);  
  
  execSQLQuery(query, parameters, res);        
  
});

/**
 * GET retorna patrimonios considerando o estado, ano, cargo, situacao e municipio
 */
router.get('/patrimonio/:estado/:ano/:cargo/:situacao/:municipio', async (req, res) => {  
  let parameters = await QueryService.recuperaParametrosPatrimonio(req);
  let query = await QueryService.recuperaConsultaPatrimonio(req);
  
  execSQLQuery(query, parameters, res);        
  
});

/**
 * GET retorna lista dos estados
 */
router.get('/patrimonio/busca/estados', async (req, res) => {   
     
  var query = "SELECT DISTINCT(estado) FROM patrimonio_candidatos ORDER BY estado";
  execSQLQuery(query, [], res); 
  
});

/**
 * GET retorna lista de cargos
 */
router.get('/patrimonio/busca/cargos', async (req, res) => {   
     
  var query = "SELECT DISTINCT(cargo_pleiteado_2) FROM patrimonio_candidatos ORDER BY cargo_pleiteado_2";
  execSQLQuery(query, [], res); 
  
});

/**
 * GET retorna lista de municípios de um estado
 */
router.get('/patrimonio/municipios/:estado', async (req, res) => {   
  let parameters = [req.params.estado];
  var query = "SELECT DISTINCT(unidade_eleitoral) FROM patrimonio_candidatos WHERE estado = ? ORDER BY unidade_eleitoral";
  execSQLQuery(query, parameters, res); 
  
});


/**
 * GET retorna lista de situações
 */
router.get('/patrimonio/busca/situacao', async(req, res) => {
  var query = "SELECT DISTINCT(situacao_eleicao_1) FROM patrimonio_candidatos";
  execSQLQuery(query, [], res);
})

/*
* GET retorna a lista de ganho relativo por candidato por estado
*/
router.get('/patrimonio/estados', async(req, res) => {
  var query = "SELECT estado, ganho_relativo FROM patrimonio_candidatos"
  execSQLQuery(query, [], res);
}) 


/*
* GET retorna a lista de ganho relativo por candidato por estado filtrando por ano
*/
router.get('/patrimonio/estados/:ano', async(req, res) => {
  let parameters = [req.params.ano]
  var query = "SELECT estado, ganho_relativo FROM patrimonio_candidatos WHERE ano_um = ?"
  execSQLQuery(query, parameters, res);
}) 

function execSQLQuery(sqlQuery, parameters, res){

  pool.getConnection(function(err, connection) {
    
    connection.query(sqlQuery, parameters, function (error, results, fields) {
      
      if (error) {
        res.status(400).json(error);
      } else {
        res.status(200).json(results);
      }

      connection.release();            
          
    });
  });

}


module.exports = router;