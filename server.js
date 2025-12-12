import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const dataFilePath = path.join(__dirname, 'database', 'data.json');

function readTasks() {
   try {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
   } catch (err) {
      return { tasks: [] };
   }
}

function writeTasks(data) {
   fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

   if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
   }

   if (req.url === '/api/tasks' && req.method === 'GET') {
      const data = readTasks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
      return;
   }

   if (req.url === '/api/tasks' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
         body += chunk.toString();
      });
      req.on('end', () => {
         try {
            const newTask = JSON.parse(body);
            const data = readTasks();
            
            const newId = data.tasks.length > 0 ? Math.max(...data.tasks.map(t => t.id)) + 1 : 1;
            newTask.id = newId;
            newTask.completed = newTask.completed || false;
            // Image is already in Base64 format from frontend
            
            data.tasks.push(newTask);
            writeTasks(data);
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newTask));
         } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
         }
      });
      return;
   }

   if (req.url.startsWith('/api/tasks/') && req.method === 'DELETE') {
      const id = parseInt(req.url.split('/')[3]);
      const data = readTasks();
      data.tasks = data.tasks.filter(t => t.id !== id);
      writeTasks(data);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Task deleted' }));
      return;
   }

   // Serve static files
   const filePath = path.join(__dirname, 'Public', req.url === '/' ? 'index.html' : req.url);
   const ext = path.extname(filePath);
   let contentType = 'text/html';
   
   if (ext === '.css') contentType = 'text/css';
   else if (ext === '.js') contentType = 'application/javascript';
   
   fs.readFile(filePath, (err, data) => {
      if (err) {
         res.writeHead(404, { 'Content-Type': 'text/html' });
         res.end('<h1>404 - File Not Found</h1>');
      } else {
         res.writeHead(200, { 'Content-Type': contentType });
         res.end(data);
      }
   });
});

const PORT = 3000;

server.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});