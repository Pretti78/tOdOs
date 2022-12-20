const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { json } = require('body-parser');

const app = express();

const jsonPath = path.resolve('./files/tasks.json');

app.get('/task', async (req, res) => {
	const tasksArray = await fs.readFile(jsonPath, 'utf8');
	res.send(tasksArray);
});

app.use(express.json());

app.post('/task', async (req, res) => {
	const task = req.body;
	const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
	const lastIndex = tasksArray.length - 1;
	const newId = lastIndex + 1;
	tasksArray.push({ ...task, id: newId });
	await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
	res.end();
});

app.put('/task', async (req, res) => {
	const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
	const { status, id } = req.body;
	const taskIndex = tasksArray.findIndex((task) => task.id === id);
	if (taskIndex >= 0) {
		tasksArray[taskIndex].status = status;
	}
	await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
	res.send('se actualizo el status xd');
});

app.delete('/task', async (req, res) => {
	const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
	const { id } = req.body;
	const taskIndex = tasksArray.findIndex((task) => task.id === id);
	tasksArray.splice(taskIndex, 1);
	await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
	res.send('se borro la task');
});

const PORT = 8000;

app.listen(PORT, () => {
	console.log('is the live');
});
