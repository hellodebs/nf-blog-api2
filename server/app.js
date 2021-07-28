const express = require("express");
const db = require("./lib/db");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
  });
});

app.get("/articles", (req, res) => {
  db.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch(() => res.status(500).send("There was a mistake"));
});

app.post("/articles", (req, res) => {
  const articles = req.body;
  db.insert(articles).then((data) => {
    res.status(201).send(data);
  });
});

app.get("/articles/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).end();
        return;
      }

      res.send(data);
    })
    .catch(() => {
      res.status(500).send();
    });
});

app.patch("/articles/:id", (req, res) => {
  const id = req.params.id;
  const content = req.body;
  console.log(content);
  db.updateById(id, content)
    .then((data) => {
      if (!data) {
        throw "Article was not found";
      }
      res.send(data);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.delete("/articles/:id", (req, res) => {
  const id = req.params.id;
  db.deleteById(id)
    .then(() => {
      res.status(204).send();
    })
    .catch(() => {
      res.status(500).end();
    });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
