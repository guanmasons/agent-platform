import axios from "axios";
import { DATASTORE_API_URL } from "../config";
import { Agent } from "../types/agent";

export class AgentService {
  async getAgent(id: string, userId: string): Promise<Agent | null> {
    try {
      const response = await axios.get(`${DATASTORE_API_URL}/agents/${id}`);
      // filter out the result that doesn't have matching userId
      if (response.data.userId === userId) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching agent from datastore-api:", error);
      throw error;
    }
  }

  async createAgent(agent: Agent): Promise<Agent> {
    try {
      const response = await axios.post(`${DATASTORE_API_URL}/agents`, agent);
      return response.data;
    } catch (error) {
      console.error("Error creating agent in datastore-api:", error);
      throw error;
    }
  }

  async updateAgent(agent: Agent): Promise<Agent> {
    try {
      const response = await axios.put(
        `${DATASTORE_API_URL}/agents/${agent.id}`,
        agent
      );
      return response.data;
    } catch (error) {
      console.error("Error updating agent in datastore-api:", error);
      throw error;
    }
  }

  async deleteAgent(id: string, userId: string): Promise<void> {
    try {
      const agent = await this.getAgent(id, userId);
      if (!agent) {
        throw new Error("Agent not found or not authorized");
      }
      await axios.delete(`${DATASTORE_API_URL}/agents/${id}`);
    } catch (error) {
      console.error("Error deleting agent in datastore-api:", error);
      throw error;
    }
  }

  async getAgentsByUserId(userId: string): Promise<Agent[]> {
    try {
      const response = await axios.get(`${DATASTORE_API_URL}/users/${userId}/agents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agents by userId from datastore-api:', error);
      throw error;
    }
  }
}