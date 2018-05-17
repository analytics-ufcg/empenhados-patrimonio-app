export class QueryService {

    static recuperaParametros(req) {
        let parameters;

        console.log(req.params);

        if (req.params.estado === 'todos') {
            parameters = [req.params.ano, req.params.cargo, req.params.situacao];
        } else {
            parameters = [req.params.estado, req.params.ano, req.params.cargo, req.params.situacao];
        }

        return parameters;
    }

    static recuperaConsulta(req) {
        let query;

        if (req.params.estado === 'todos') {
            query = "SELECT * FROM patrimonio_candidatos WHERE ano_um = ? AND cargo_pleiteado_1 = ? AND resultado_1 = ?";
        } else {
            query = "SELECT * FROM patrimonio_candidatos WHERE estado = ? AND ano_um = ? AND cargo_pleiteado_1 = ? AND resultado_1 = ?";
        }       

        return query;
    }

}