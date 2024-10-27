import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

// Criar usuário
app.post('/usuarios', async (req, res) => {
    const { email, name, telefone, endereco } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                telefone,
                endereco,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'User creation failed' });
    }
});

// Listar usuários com filtros opcionais
app.get('/usuarios', async (req, res) => {
    try {
        const { name, email } = req.query;

        const whereClause = {};
        if (name) whereClause.name = name;
        if (email) whereClause.email = email;

        const users = await prisma.user.findMany({
            where: whereClause,
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { email, name, telefone, endereco } = req.body;

    if (!email && !name && !telefone && !endereco) {
        return res.status(400).json({ error: 'Provide at least one field to update' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { email, name, telefone, endereco },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

// Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
