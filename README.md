# Todo App

A simple and modern todo application built with Node.js, HTML, CSS, and JavaScript.

## Features

- ✅ Create new tasks with title, date, and description
- ✅ View all tasks in a beautiful list
- ✅ Delete tasks
- ✅ Persistent storage using JSON database
- ✅ RESTful API endpoints
- ✅ Responsive design with modern CSS

## Project Structure

```
todo-app/
├── Public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/
│   └── data.json
├── server.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <your-github-repo-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

## Usage

Start the server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## API Endpoints

- **GET** `/api/tasks` - Fetch all tasks
- **POST** `/api/tasks` - Create a new task
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

## Technologies Used

- **Backend**: Node.js, Express-like HTTP server
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: JSON file storage

## License

MIT
