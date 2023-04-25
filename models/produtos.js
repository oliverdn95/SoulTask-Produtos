const { model, Schema } = require("mongoose");
const Joi = require('joi');

const Produtos = model(
    "produto", 
    new Schema({
        nome: {
            type: String, //String,number,boolean
            required: true,
        },
        descricao: {
            type: String,
            required: true,
        },
        quantidade : {
            type: Number,
            required: true,
        },
        preco : {
            type: Number,
            required: true,
        },
        desconto : {
            type: String,
        },
        dataDesconto : {
            type: Date,
        },
        categoria : {
            type: String,
            required: true,
        },
        imagemProduto : {
            type: String,
        },
    })
);

const ProdutoJoi = Joi.object({
        nome: Joi.string().required().messages({
            "any-required": "Campo nome é obrigatório",
            "string.base": "Campo nome tem que ser uma string",
            "string.empty": "Campo nome não pode estar vazio"
            
        }), 
        descricao: Joi.string().required().messages({
            "any-required": "Campo descrição é obrigatório",
            "string.base": "Campo descrição tem que ser uma string",
            "string.empty": "Campo descrição não pode estar vazio"
        }), 
        quantidade : Joi.number().min(0).integer().required().messages({
            "any-required": "Campo quantidade é obrigatório",
            "number.base": "Campo quantidade tem que ser um número",
            "number.min": "Campo quantidade tem que ser maior que 0",
            "number.interger": "Campo quantidade tem que ser inteiro",
            "number.empty": "Campo quantidade não pode estar vazio"
        }), 
        preco : Joi.number().min(0).required().messages({ //TODO verificar por que não está dando a mensagem de erro certo
            "any-required": "Campo preco é obrigatório",
            "number.base": "Campo preco tem que ser um número",
            "number.min": "Campo preco tem que ser maior que 0",
            "number.empty": "Campo preco não pode estar vazio"
        }), 
        desconto : Joi.string().messages({
            "string.base": "Campo desconto tem que ser uma string"
        }), 
        dataDesconto : Joi.date().iso().messages({
            "date.base": "Campo dataDesconto tem que ser uma data",
            "date.iso": "Campo dataDesconto tem que estar no padrão americano YYYY-MM-DD"
        }),
        categoria : Joi.string().required().messages({
            "any-required": "Campo categoria é obrigatório",
            "string.base": "Campo categoria tem que ser uma string",
            "string.empty": "Campo categoria não pode estar vazio"
        }), 
        imagemProduto : Joi.string().messages({
            "string.base": "Campo imagemProduto tem que ser uma string"
        })
});


module.exports = { Produtos, ProdutoJoi };