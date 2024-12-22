import express, { Request, Response } from "express";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { UserModel } from "./models/user";
import { AgentModel } from "./models/agent";
import {
  SERVICE_PORT,
  SERVICE_REGION,
  DYNAMODB_USER_TABLE,
  DYNAMODB_AGENT_TABLE,
  DYNAMODB_USER_LOGIN_TABLE,
} from "./config";
import { User } from "./types/user";
import { Agent } from "./types/agent";

const app = express();
app.use(express.json());

const dynamodbClient = new DynamoDBClient({ region: SERVICE_REGION });
const userModel = new UserModel(dynamodbClient, DYNAMODB_USER_TABLE, DYNAMODB_USER_LOGIN_TABLE);
const agentModel = new AgentModel(dynamodbClient, DYNAMODB_AGENT_TABLE);

// User API Routes
app.get("/users/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.getUser(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/users", async (req: Request, res: Response) => {
  const user: User = req.body;
  try {
    const createdUser = await userModel.createUser(user);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/users/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user: User = req.body;
  user.userId = userId; // Ensure the userId is in the body

  try {
    const updatedUser = await userModel.updateUser(user);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/users/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    await userModel.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Agent API Routes
app.get("/agents/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const agent = await agentModel.getAgent(id);
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

app.post("/agents", async (req: Request, res: Response) => {
  try {
    const agentData: Partial<Agent> = req.body;
    const agent: Agent = {
      id: agentData.id || crypto.randomUUID(),
      name: agentData.name || '',
      userId: agentData.userId || '',
      description: agentData.description || '',
      status: agentData.status || 'inactive',
      scope: agentData.scope || '',
      oosAction: agentData.oosAction || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: agentData.url || '',
      mstpAddr: agentData.mstpAddr || ''
    };
    
    const createdAgent = await agentModel.createAgent(agent);
    res.status(201).json(createdAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/agents/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const existingAgent = await agentModel.getAgent(id);
    if (!existingAgent) {
      return res.status(404).send("Agent not found");
    }

    const agentData: Partial<Agent> = req.body;
    const updatedAgent: Agent = {
      ...existingAgent,
      ...agentData,
      id,
      updatedAt: new Date().toISOString()
    };

    const result = await agentModel.updateAgent(updatedAgent);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/agents/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await agentModel.deleteAgent(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/users/:userId/agents', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const agents = await agentModel.getAgentsByUserId(userId);
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(SERVICE_PORT, () => {
  console.log(`Datastore API listening on port ${SERVICE_PORT}`);
});