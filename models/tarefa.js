const { model, Schema } = require("mongoose");
const Joi = require('joi');

// 2) Criar o modelo de Tarefa(Task)
// título, descrição e status(finalizada/pendente)
const Tarefa = model(
    "tarefa", //Nome do modelo(base p/ colecao)
    new Schema({ //Validação do Documento
        titulo: {
            type: String, // String, number, boolean
            required: true
        },
        descricao: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: "pendente" // ou finalizada
        }
    })
);

const TarefaJoi = Joi.object({
    titulo: Joi.string().required().messages({
        "any-required": "Campo nome é obrigatório",
        "string.base": "Campo nome tem que ser uma string",
        "string.empty": "Campo nome não pode estar vazio"
        
    }), 
    descricao: Joi.string().required().messages({
        "any-required": "Campo descrição é obrigatório",
        "string.base": "Campo descrição tem que ser uma string",
        "string.empty": "Campo descrição não pode estar vazio"
    }), 
    status : Joi.string().required().messages({
        "any-required": "Campo categoria é obrigatório",
        "string.base": "Campo categoria tem que ser uma string",
        "string.empty": "Campo categoria não pode estar vazio"
    })
});

module.exports = {Tarefa, TarefaJoi};