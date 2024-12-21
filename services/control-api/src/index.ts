import express, { Request, Response } from "express";
import {
  SERVICE_PORT,
} from "./config";
import { AgentService } from "./services/agent";
import { authenticate } from "./middleware/auth";

const app = express();
app.use(express.json());

const agentService = new AgentService();

app.get("/agents/:agentId", authenticate, async (req: Request, res: Response) => {
  // only return agent if agent's userId matches the request
const agentId = req.params.agentId;
  const userId = req.user?.sub; // subject claim from JWT
  try {
    const agent = await agentService.getAgent(agentId, userId);
    if (agent) {
      res.json(agent);
    } else {
      res.status(404).send("Agent not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/agents", authenticate, async (req: Request, res: Response) => {
  const agent = req.body;
  agent.userId = req.user?.sub; // subject claim from JWT
  try {
    const createdAgent = await agentService.createAgent(agent);
    res.status(201).json(createdAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/agents/:agentId", authenticate, async (req: Request, res: Response) => {
  const agentId = req.params.agentId;
  const agent = req.body;
  agent.userId = req.user?.sub; // subject claim from JWT
  agent.agentId = agentId;
  try {
    const updatedAgent = await agentService.updateAgent(agent);
    res.json(updatedAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/agents/:agentId", authenticate, async (req: Request, res: Response) => {
  const agentId = req.params.agentId;
  const userId = req.user?.sub; // subject claim from JWT
  try {
    await agentService.deleteAgent(agentId, userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/users/agents', authenticate, async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  try {
    const agents = await agentService.getAgentsByUserId(userId);
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(SERVICE_PORT, () => {
  console.log(`Control API listening on port ${SERVICE_PORT}`);
});