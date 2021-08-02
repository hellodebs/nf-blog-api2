const express = require("express");
//const db = require("./lib/db");
const cors = require("cors");
const mongoose = require("mongoose");
const Article = require("./models/article");
const Author = require("./models/author");

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

/* Time of the request, Method and URL */
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("Time: ", new Date());
  console.log("Request Type: ", req.method);
  console.log("Url: ", req.url);
  next();
});

/*Write a custom middleware to validate that the parameter :id  represents a number (“1” is valid, “x” is not). 
If it’s not a number, send a 400 message back and end the request/response cycle. */

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
  });
});

// function validateRequest(req, res, next) {
//   if (!req.body.title) {
//     res.status(400).json({
//       error: "Request body must contain a title property",
//     });
//     return;
//   }
//   if (!req.body.body) {
//     res.status(400).json({
//       error: "Request body must contain a body property",
//     });
//     return;
//   }

//   next();
// }

app.get("/articles", (req, res) => {
  Article.find()
    .populate("author")
    .then((data) => {
      res.send(data);
    })
    .catch(() => res.status(500).send("There was a mistake"));
});

app.post("/articles", (req, res) => {
  Article.create(req.body)
    .then((data) => {
      console.log(data.populate("author"));

      res.status(201).send(data);
    })
    .catch(() => res.status(500).send("There was a mistake"));
});

app.get("/articles/:id", (req, res) => {
  const id = req.params.id;
  Article.findById(id)
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

  Article.findByIdAndUpdate(id, content, { new: true })
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
  Article.findByIdAndRemove(id)
    .then(() => {
      res.status(204).send();
    })
    .catch(() => {
      res.status(500).end();
    });
});

//create an author
app.post("/authors", (req, res) => {
  Author.create(req.body)

    .then((data) => {
      res.status(201).send(data);
    })
    .catch(() => res.status(500).send("There was a mistake"));
});

//list all authors
app.get("/authors", (req, res) => {
  Author.find()

    .then((data) => {
      res.send(data);
    })
    .catch(() => res.status(500).send("There was a mistake"));
});

/*
  We connect to MongoDB and when the connection is successful 
   put our express app to listen in port 4000
  */

mongoose
  .connect("mongodb://localhost:27017/articles-api", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("conntected to mongo");
    app.listen(4000, () => {
      console.log("Listening on http://localhost:4000");
    });
  })
  .catch((error) => {
    console.error(error);
  });
