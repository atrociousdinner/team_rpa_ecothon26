import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

router.post('/recommend', (req, res) => {
  const tags = req.body.tags; 
  const py = spawn('python3', ['src/model/recommend.py', JSON.stringify({ tags })]);

  let stdoutData = '';
  let stderrData = '';

  py.stdout.on('data', (chunk) => {
    stdoutData += chunk.toString();
  });

  py.stderr.on('data', (chunk) => {
    stderrData += chunk.toString();
    console.error(`Python stderr: ${chunk.toString()}`);
  });

  py.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      console.error(stderrData);
      return res.status(500).json({ error: 'Python script failed', details: stderrData });
    }
    try {
      const result = JSON.parse(stdoutData);
      res.json(result);
    } catch (e) {
      console.error("Failed to parse Python stdout JSON:", e);
      console.error("Python stdout was:", stdoutData);
      return res.status(500).json({ error: 'Failed to parse recommendation results' });
    }
  });
});

export default router;
