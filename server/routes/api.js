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
 * GET retorna lista de anos em que um cargo pode aparecer
 */
router.get('/patrimonio/busca/ano/:cargo', async (req, res) => {   
  let parameters = [req.params.cargo];
  var query = "SELECT DISTINCT(ano_um) FROM patrimonio_candidatos WHERE cargo_pleiteado_1 = ?";
  
  execSQLQuery(query, parameters, res); 
  
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

router.get('/candidato/:ano/:cpfcandidato', async(req, res) => {
  let parameters = [req.params.ano, req.params.cpfcandidato];
  var query = "SELECT DISTINCT(cpf_Candidato), c.nome_Urna_Candidato, o.desc_Ocupacao, u.desc_Unid_Eleitoral, c.idade_Cand_Data_Eleicao, c.data_Nascimento FROM candidatos_eleicao c, cod_ocupacao o, cod_unidade_eleitoral u WHERE c.cod_Ocupacao = o.cod_Ocupacao AND c.sigla_Unid_Eleitoral = u.sigla_Unid_Eleitoral AND ano_Eleicao = ? AND c.cpf_Candidato = ?";

  execSQLQuery(query, parameters, res);
});

router.get('/eleicao/:ano/:unidadeeleitoral/:cargo/:cpfcandidato', async(req, res) => {  
  let parameters = [req.params.ano, req.params.unidadeeleitoral, req.params.cargo, req.params.cpfcandidato];  
  var query = "select COUNT(*) AS quantidade_candidatos, IFNULL(AVG(patrimonio_eleicao_1), 0) AS media_patrimonio from patrimonio_candidatos where ano_um = ? AND unidade_eleitoral = ? AND cargo_pleiteado_1 = ? AND cpf != ?";

  execSQLQuery(query, parameters, res);
});

router.get('/unidadeEleitoral/:cdUnidEleitoral', async(req, res) => {  
  let parameters = [req.params.cdUnidEleitoral];  
  var query = "select * from utils.idh where cd_Unid_Eleitoral = ?";

  execSQLQuery(query, parameters, res);
});

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