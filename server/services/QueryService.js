export class QueryService {

    static recuperaParametrosPatrimonio(req) {
        let parameters = [];

        let request = Object.values(req.params);

        request.forEach(function (item, indice, array) {
            if (item !== 'todos') {
                parameters.push(item);
            }
        });

        return parameters;
    }

    static recuperaConsultaPatrimonio(req) {
        let query;

        let filtros = '';

        let request = Object.values(req.params);
        let columns = ['estado', 'ano_um', 'cargo_pleiteado_1', 'situacao_eleicao_1', 'unidade_eleitoral'];        

        request.forEach(function (item, indice, array) {
            
            if (item !== 'todos') {
                if (filtros === '') {
                    filtros = filtros + columns[indice] + ' = ?';    
                } else {
                    filtros = filtros + ' AND ' + columns[indice] + ' = ?';    
                }
            }
        });

        query = "SELECT patrimonio_eleicao_1, patrimonio_eleicao_2, nome_urna, cpf, sigla_partido, cod_unidade_eleitoral_1, cod_unidade_eleitoral_2, unidade_eleitoral, cargo_pleiteado_1, cargo_pleiteado_2, ano_um, sequencial_candidato_1, sequencial_candidato_2, situacao_eleicao_1, situacao_eleicao_2  FROM patrimonio_candidatos WHERE " + filtros;

        return query;
    }

}