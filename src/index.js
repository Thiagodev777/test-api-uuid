const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const projects = [];

function logRoutes(req, res, next){
  const { method, url } = req;
  const route = `[${method}] ${url}`
  console.log(route);
  return next();
}

app.use(logRoutes);

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', (req, res) => {
  const { name, owner } = req.body;
  const project = { id: uuidv4(), name, owner };
  projects.push(project)
  return res.status(201).json(project);
})

app.put('/projects/:id', (req, res) => {
  const {id} = req.params;
  const {name, owner} = req.body;
  const projectIndex = projects.findIndex(p => p.id === id);
  if(projectIndex < 0){
    return res.status(404).json({error: 'Project not found!'})
  }
  if(!name || !owner){
    return res.status(400).json({error: 'name and owner are required!'})
  }
  const project = { id, name, owner };
  projects[projectIndex] = project;
  return res.status(201).json(project)
})

app.delete('/projects/:id', (req, res) => {
  const {id} = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  if(projectIndex < 0){
    return res.status(404).json({error: 'Project not found!'})
  }
  projects.splice(projectIndex, 1)
  return res.status(204).end();
})


app.listen(8089, () => console.log('run'))