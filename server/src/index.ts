import express from 'express';
import { Express,Request,Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cros from "cors";

const app: Express = express();
const PORT = 3030;

const prisma = new PrismaClient();

app.use(express.json());
app.use(cros());

app.get('/allTodos', async (req: Request, res: Response) => {
    const allTodos = await prisma.todo.findMany();
    return res.json(allTodos);
});

app.post('/createTodo', async (req: Request, res: Response) => {
    const { title, isCompleted } = req.body;
    const createTodo = await prisma.todo.create({
        data: {
            title,
            isCompleted, 
        },
    })
    return res.json(createTodo);
});
1

app.put('/editTodo/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, isCompleted } = req.body;

        const editTodo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                isCompleted,
            },
        });

        return res.json(editTodo);
    } catch (error) {
        console.error('Error updating todo:', error);

        // error を型キャストして message プロパティにアクセス
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});

app.delete('/deleteTodo/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const deleteTodo = await prisma.todo.delete({
        where:{id}
    })
    return res.json(deleteTodo);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
 