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

app.get("/users/email/:email", async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const user = await userModel.getUserByEmail(email);
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

// Agent API Routes
app.get("/agents/:agentId", async (req: Request, res: Response) => {
  const agentId = req.params.agentId;
  try {
    const agent = await agentModel.getAgent(agentId);
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
  const agent: Agent = req.body;
  try {
    const createdAgent = await agentModel.createAgent(agent);
    res.status(201).json(createdAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/agents/:agentId", async (req: Request, res: Response) => {
  const agentId = req.params.agentId;
  const agent: Agent = req.body;
  agent.agentId = agentId;

  try {
    const updatedAgent = await agentModel.updateAgent(agent);
    res.json(updatedAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/agents/:agentId", async (req: Request, res: Response) => {
  const agentId = req.params.agentId;
  try {
    await agentModel.deleteAgent(agentId);
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