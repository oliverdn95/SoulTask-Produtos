/**
 * @swagger
 * components:
 *   schemas:
 *     Produtos:
 *       type: object
 *       required:
 *       properties:
 *         _id:
 *           type: string
 *           description: É automaticamente gerado um ID para o produto
 *         nome:
 *           type: string
 *           required: true
 *           description: Nome do Produto
 *         descricao:
 *           type: string
 *           required: true
 *           description: Descricao do Produto
 *         quantidade:
 *           type: number
 *           required: true
 *           min: 0
 *           integer: true
 *           description: Quantidade de Produtos
 *         preco:
 *           type: number
 *           required: true
 *           min: 0
 *           description: Preco do Produto
 *         desconto:
 *           type: string
 *           required: false
 *           description: Desconto no valor do Produto
 *         dataDesconto:
 *           type: date
 *           required: false
 *           iso: true
 *           description: Data do desconto aplicado no formato iso 'aaaa-mm-dd'
 *         categoria:
 *           type: string
 *           required: true
 *           description: Categoria do Produto
 *         imagemProduto:
 *           type: string
 *           required: false
 *           description: URL da imagem do Produto
 *         __v:
 *           type: number
 *           required: false
 *           description: Numero da versão do objeto
 *       example:
 *         _id: 6447e05b6317e66278b2e2b6
 *         nome: CD do Y-no
 *         descricao: CD do grupo de pagode japones
 *         quantidade: 1
 *         preco: 20
 *         desconto: 10%
 *         dataDesconto: 2023-04-24T00:00:00.000Z
 *         categoria: Pagode japones
 *         imagemProduto: https://m.media-amazon.com/images/I/91plTtmOjeL._AC_SX425_.jpg
 *         __v: 0
 */

const {Router} = require("express");
const { Produtos, ProdutoJoi } = require("../models/produtos");

const router = Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API E-commerce de CDs de K-pop 
 * /produtos:
 *   post:
 *     summary: Insere um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos'
 *     responses:
 *       201:
 *         description: Mostra o produto adicionado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos'
 *       400:
 *         description: Mostra o erro de requisição indevida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos'
 *       500:
 *         description: Mostra a ocorrencia de um erro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos' 
 */

//Inserção de Produto (POST)
router.post('/produtos', upload.single('imagemProduto'), async (req, res) => {
    try {
        const { error, value } = ProdutoJoi.validate(req.body);

        if (error) {
            return res.status(400).json(error.details[0].message);
        } else if (value) {
            const novoProduto = new Produtos({
                ...value,
                imagemProduto: req.file.path
            });
            await novoProduto.save();
            res.status(201).json(novoProduto);
        }
    } catch (err) {
        res.status(500).json({ message: 'Um erro aconteceu.' });
        console.log(err);
    }
});

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API E-commerce de CDs de K-pop 
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos'
 *     responses:
 *       200:
 *         description: Mostra todos os produtos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos'
 */

//Listar todos os produtos
router.get("/produtos", async(req,res)=>{
    const produtos = await Produtos.find();
    res.status(200).json(produtos);
});


/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API E-commerce de CDs de K-pop 
 * /produtos/busca:
 *   get:
 *     summary: Lista os produtos encontrados
 *     tags: [Produtos]
 *     parameters:
 *      - in: query
 *        name: nome
 *        schema:
 *          type: string
 *        description: Nome do produto para busca
 *      - in: query
 *        name: categoria
 *        schema:
 *          type: string
 *        description: Categoria do produto para busca
 *      - in: query
 *        name: preco
 *        schema:
 *          type: number
 *        description: Preco do produto para busca
 *      - in: query
 *        name: desconto
 *        schema:
 *          type: string
 *        description: Desconto no valor do produto
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos/busca'
 *     responses:
 *       200:
 *         description: Mostra o produto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/busca'
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/busca'
 *       500:
 *         description: Mostra a ocorrencia de um erro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/busca' 
 */

//Listar um produto
router.get("/produtos/busca", async(req,res)=>{
    try{
        const {nome, categoria, preco, desconto } = req.query;
        const produtos = await Produtos.find({
            $or: [
                {categoria: { $in: categoria }}, 
                {nome: nome }, 
                {preco: { $lte: preco }}, 
                {desconto: { $in: desconto }}
            ]
        });
        if(produtos){
            res.status(200).json(produtos)
        } else {
            res.status(404).json({message:"Produto não encontrado."})
        }
    } catch (err) {
        res.status(500).json({message:"Um erro aconteceu."})
        console.log(err)
    }
});


/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API E-commerce de CDs de K-pop 
 * /produtos/busca/{id}:
 *   get:
 *     summary: Lista um unico produto por id
 *     tags: [Produtos]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id do produto
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos/busca/{id}'
 *     responses:
 *       200:
 *         description: Mostra o produto encontrado pela id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/busca/{id}'
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/busca/{id}'
 *       500:
 *         description: Mostra a ocorrencia de um erro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/busca/{id}' 
 */

//Listar um produto
router.get("/produtos/busca/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const produto = await Produtos.findById(id);
        if(produto){
            res.status(200).json(produto)
        } else {
            res.status(404).json({message:"Produto não encontrado."})
        }
    } catch (err) {
        res.status(500).json({message:"Um erro aconteceu."})
        console.log(err)
    }
});


/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API E-commerce de CDs de K-pop 
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto pela id
 *     tags: [Produtos]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos/{id}'
 *     responses:
 *       200:
 *         description: Atualiza o produto pela id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/{id}'
 *       400:
 *         description: Mostra o erro de requisição indevida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/{id}'
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/{id}'
 *       500:
 *         description: Mostra a ocorrencia de um erro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/{id}' 
 */

//Atualizar produto
router.put("/produtos/:id", async(req,res)=>{
    try{
        const { error, value } = ProdutoJoi.validate(req.body);

        if(error){
            return res.status(400).json(error.details[0].message);
        } else if(value){
            const {id} = req.params;
            const produtoExistente = await Produtos.findByIdAndUpdate(id, value);
            if(produtoExistente) {
                res.status(200).json({message:"Produto editado."});
            } else {
                res.status(404).json({message:"Produto não encontrado."})
        }
        }

        
    } catch (err) {
        res.status(500).json({message:"Um erro aconteceu."})
        console.log(err)
    }
});

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API E-commerce de CDs de K-pop 
 * /produtos/{id}:
 *   delete:
 *     summary: Deleta um produto pela id
 *     tags: [Produtos]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id do produto
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos/{id}'
 *     responses:
 *       200:
 *         description: Produto deletado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/{id}'
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/{id}'
 *       500:
 *         description: Mostra a ocorrencia de um erro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos/{id}' 
 */

router.delete("/produtos/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const produtoExistente = await Produtos.findByIdAndDelete(id);
        if(produtoExistente){
            res.status(200).json({message: "Produto deletado."})
        } else {
            res.status(404).json({message:"Produto não encontrado."})
        }
    } catch (err) {
        res.status(500).json({message:"Um erro aconteceu."})
        console.log(err)
    }
});

module.exports = router;