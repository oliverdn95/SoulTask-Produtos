/**
 * @swagger
 * components:
 *   schemas:
 *     Tarefas:
 *       type: object
 *       required:
 *       properties:
 *         _id:
 *           type: string
 *           description: É automaticamente gerado um ID para a tarefa
 *         titulo:
 *           type: string
 *           required: true
 *           description: Título da tarefa
 *         descricao:
 *           type: string
 *           required: true
 *           description: Descrição da tarefa
 *         status:
 *           type: string
 *           required: true
 *           description: Estado da tarefa("finalizada", "pendente")
 *         __v:
 *           type: number
 *           required: false
 *           description: Numero da versão do objeto
 *       example:
 *         _id: 644694dcb2a1d8299da307a6
 *         titulo: Estudar MongoDB
 *         descricao: Ler a documentação do MongoDB Atlas
 *         status: finalizada
 *         __v: 0
 */
const { Router } = require("express");
const {Tarefa, TarefaJoi} = require("../models/tarefa");

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: O API E-commerce de CDs de K-pop
 * /tarefas:
 *   post:
 *     summary: Adiciona uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/tarefas'
 *     responses:
 *       201:
 *         description: Mostra a tarefa que foi adicionado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas'
 *       400:
 *         description: Mostra o erro de requisição indevida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas'
 *       500:
 *         description: Mostra a ocorrencia de um erro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas'
 *  
 */
// 3) Criar as rotas GET, POST, PUT e DELETE
// Inserção de tarefa(POST)
router.post("/tarefas", async (req, res) => {
    try{
        const { error, value } = TarefaJoi.validate(req.body);

        if(error){
            return res.status(400).json(error.details[0].message);
        }else if(value){
            // Criando um novo documento do Mongo
            const tarefa = new Tarefa(value);

            await tarefa.save();
            res.status(201).json(tarefa);
        }
        
    }catch (err) {
        console.log(err);
        res.status(500).json({ message : "Um erro aconteceu." });
    }
});

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: O API E-commerce de CDs de K-pop
 * /tarefas:
 *   get:
 *     summary: Mostra todas as tarefas
 *     tags: [Tarefas]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/tarefas'
 *     responses:
 *       200:
 *         description: Mostra as tarefas que já foram adicionadas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas'
 */
// Listagem de todas as Tarefas(GET)
router.get("/tarefas", async (req, res) => {
    //Realiza uma busca em todos os docs da coleção
    const tarefas = await Tarefa.find();
    res.status(200).json(tarefas);
});

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: O API E-commerce de CDs de K-pop
 * /tarefas/{id}:
 *   get:
 *     summary: Mostra uma única tarefa pelo ID
 *     tags: [Tarefas]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID da Tarefa
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/tarefas/{id}'
 *     responses:
 *       200:
 *         description: Mostra uma tarefa pelo ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 *       404:
 *         description: Mostra as tarefa não foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 *       500:
 *         description: Mostra que um erro aconteceu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 */
// Listagem de uma Tarefas(GET)
router.get("/tarefas/:id", async (req, res) => {

    const { id } = req.params;
    const tarefa = await Tarefa.findById(id);

    try{
        if(tarefa){
            res.status(200).json(tarefa);
        }else{
            res.status(404).json({ message: "Tarefa não encontrada. "});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ message : "Um erro aconteceu." });
    }
});

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: O API E-commerce de CDs de K-pop
 * /tarefas/{id}:
 *   put:
 *     summary: Atualiza a Tarefa pelo ID
 *     tags: [Tarefas]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID da Tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/tarefas/{id}'
 *     responses:
 *       200:
 *         description: Atualiza uma tarefa pelo ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 *       400:
 *         description: Mostra o erro de requisição indevida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 *       404:
 *         description: Mostra as tarefa não foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 *       500:
 *         description: Mostra que um erro aconteceu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 */
// Atualização de uma Tarefa(PUT)
router.put("/tarefas/:id", async (req, res) => {

    try{
        const { error, value } = TarefaJoi.validate(req.body);

        if(error){
            return res.status(400).json(error.details[0].message);
        }else if(value){
            const { id } = req.params;
            //caso encontre o id, realiza a atualização
            //retorna o objeto
            const tarefaExistente = await Tarefa.findByIdAndUpdate(id, value);
            
            if(tarefaExistente){
                res.status(200).json({ message: "Tarefa editada. "});
            } else{
                res.status(404).json({ message: "Tarefa não encontrada. "});
            }
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({ message : "Um erro aconteceu." });
    }
});

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: O API E-commerce de CDs de K-pop
 * /tarefas/{id}:
 *   delete:
 *     summary: Deleta a Tarefa pelo ID
 *     tags: [Tarefas]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID da Tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/tarefas/{id}'
 *     responses:
 *       200:
 *         description: Deleta uma tarefa pelo ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 *       404:
 *         description: Mostra as tarefa não foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 *       500:
 *         description: Mostra que um erro aconteceu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/tarefas/{id}'
 */
// Remoção de uma Tarefa(DELETE)
router.delete("/tarefas/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const tarefaExistente = await Tarefa.findByIdAndDelete(id);
        if(tarefaExistente){
            res.status(200).json({ message: "Tarefa excluida. "});
        }else{
            res.status(404).json({ message: "Tarefa não encontrada. "});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ message : "Um erro aconteceu." });
    }
});

module.exports = router;