require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");

// Configuração do App
const app = express();
app.use(express.json());

// 1) Conexão com o Mongo usando URL
// Configuração do MongoDB
mongoose.connect(process.env.MONGODB_URL);
const tarefasRouter = require("./routes/tarefas");
const produtosRouter = require("./routes/produtos")
app.use(tarefasRouter);
app.use(produtosRouter);

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "LogRocket Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "LogRocket",
          url: "https://logrocket.com",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );



// Escuta de eventos
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/")
})
