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
        let columns = ['estado', 'ano_um', 'cargo_pleiteado_1', 'resultado_1', 'unidade_eleitoral'];

        request.forEach(function (item, indice, array) {
            
            if (item !== 'todos') {
                if (filtros === '') {
                    filtros = filtros + columns[indice] + ' = ?';    
                } else {
                    filtros = filtros + ' AND ' + columns[indice] + ' = ?';    
                }
            }
        });

        query = "SELECT * FROM patrimonio_candidatos WHERE " + filtros;

        return query;
    }

}