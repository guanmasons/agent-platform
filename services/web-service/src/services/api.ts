import axios from 'axios';
import { CONTROL_API_BASE_URL } from '../config';
import { Agent } from '../types/agent';

export const getAgentsByUserId = async (token: string): Promise<Agent[]> => {
  try {
    const response = await axios.get(`${CONTROL_API_BASE_URL}/users/agents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

export const createAgent = async (agent: Agent, token: string): Promise<Agent> => {
  try {
    const response = await axios.post(`${CONTROL_API_BASE_URL}/agents`, agent, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

export const updateAgent = async (agent: Agent, token: string): Promise<Agent> => {
  try {
    const response = await axios.put(`${CONTROL_API_BASE_URL}/agents/${agent.id}`, agent, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
};

export const deleteAgent = async (id: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${CONTROL_API_BASE_URL}/agents/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw error;
  }
};