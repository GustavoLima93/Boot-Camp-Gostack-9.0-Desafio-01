const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let countRequest = 0;

server.use((req, res, next) => {
  console.log(`Number os request ${(countRequest += 1)}`);
  next();
});

const verifyProjectsId = (req, res, next) => {
  const { id } = req.params;

  if (!projects[id]) {
    return res.status(400).json({ error: "project does not exist" });
  }

  next();
};

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", verifyProjectsId, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  projects[id].title = title;

  return res.json(projects[id]);
});

server.delete("/projects/:id", verifyProjectsId, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send();
});

/** Add tasks */

server.post("/projects/:id/tasks", verifyProjectsId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  return res.json(projects[id]);
});

server.listen(3000);
