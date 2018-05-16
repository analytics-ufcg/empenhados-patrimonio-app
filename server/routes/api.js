import express from 'express';
var pool = require('../config/db_config.js');

const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works!!!');
});

/**
 * GET retorna patrimonios considerando o estado, ano e cargo e situacao
 */
router.get('/patrimonio/:estado/:ano/:cargo/:situacao', async (req, res) => {  
  let parameters = [req.params.estado, req.params.ano, req.params.cargo, req.params.situacao];

  var query = "SELECT * FROM patrimonio_candidatos WHERE estado = ? AND ano_um = ? AND cargo_pleiteado_1 = ? AND resultado_1 = ?";
  execSQLQuery(query, parameters, res);        
  
});

/**
 * GET retorna patrimonios considerando o estado, ano e cargo e situacao
 */
router.get('/patrimonio/:estado/:ano/:cargo/:situacao/:municipio', async (req, res) => {  
  let parameters = [req.params.estado, req.params.ano, req.params.cargo, req.params.situacao, req.params.municipio];

  var query = "SELECT * FROM patrimonio_candidatos WHERE estado = ? AND ano_um = ? AND cargo_pleiteado_1 = ? AND resultado_1 = ? AND unidade_eleitoral = ?";
  execSQLQuery(query, parameters, res);        
  
});

/**
 * GET retorna patrimonios considerando o estado, ano e cargo
 */
router.get('/patrimonio/:estado/:ano/:cargo', async (req, res) => {  
  let parameters = [req.params.estado, req.params.ano, req.params.cargo];

  var query = "SELECT * FROM patrimonio_candidatos WHERE estado = ? AND ano_um = ? AND cargo_pleiteado_1 = ?";
  execSQLQuery(query, parameters, res);        
  
});

/**
 * GET retorna patrimonios considerando o estado
 */
router.get('/patrimonio/:estado', async (req, res) => {    
  let parameters = [req.params.estado];
  var query = "SELECT * FROM patrimonio_candidatos WHERE estado = ?";
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
 * Temporário!!! Enquanto os dados são são atualizados
 */
router.get('/patrimonio/busca/situacao', async(req, res) => {
  var query = " SELECT DISTINCT(resultado_1) FROM patrimonio_candidatos";
  execSQLQuery(query, [], res);
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