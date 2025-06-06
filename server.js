const express = require('express');
const path = require('path');
const { markTopicAsCompleted, unmarkTopicAsCompleted, getTopicProgress } = require('./database');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rota para marcar tópico como concluído
app.post('/api/progress/complete', async (req, res) => {
    try {
        const { area, subject, topic } = req.body;
        await markTopicAsCompleted(area, subject, topic);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para desmarcar tópico como concluído
app.post('/api/progress/uncomplete', async (req, res) => {
    try {
        const { area, subject, topic } = req.body;
        await unmarkTopicAsCompleted(area, subject, topic);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para obter progresso de um tópico
app.get('/api/progress', async (req, res) => {
    try {
        const { area, subject, topic } = req.query;
        const progress = await getTopicProgress(area, subject, topic);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 