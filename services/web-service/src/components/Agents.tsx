import React, { useState, useEffect, ChangeEvent } from 'react';
import { getAgentsByUserId, createAgent, updateAgent, deleteAgent } from '../services/api';
import keycloak from '../auth/keycloak';
import { Agent } from '../types/agent';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState<Agent>({
    id: '',
    name: '',
    userId: '',
    description: '',
    status: 'inactive',
    scope: '',
    oosAction: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    url: '',
    mstpAddr: ''
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        if (!keycloak.token) {
          console.error('Access token is not available.');
          return;
        }
        const agentData = await getAgentsByUserId(keycloak.token);
        setAgents(agentData);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (editingAgent) {
      setEditingAgent({
        ...editingAgent,
        [name]: value,
      });
    } else {
      setNewAgent({
        ...newAgent,
        [name]: value,
      });
    }
  };

  const handleCreateAgent = async () => {
    try {
      if (!keycloak.token) {
        console.error('Access token is not available.');
        return;
      }
      const createdAgent = await createAgent(newAgent, keycloak.token);
      setAgents([...agents, createdAgent]);
      setNewAgent({
        id: '',
        name: '',
        userId: '',
        description: '',
        status: 'inactive',
        scope: '',
        oosAction: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        url: '',
        mstpAddr: ''
      });
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const handleUpdateAgent = async () => {
    try {
      if (!editingAgent || !keycloak.token) {
        console.error('No agent selected for update or token not available.');
        return;
      }
      const updatedAgent = await updateAgent(editingAgent, keycloak.token);
      setAgents(agents.map(agent => 
        agent.id === updatedAgent.id ? updatedAgent : agent
      ));
      setEditingAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    try {
      if (!keycloak.token) {
        console.error('Access token is not available.');
        return;
      }
      await deleteAgent(id, keycloak.token);
      setAgents(agents.filter(agent => agent.id !== id));
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
  };

  return (
    <div>
      <h1>Agents</h1>
      <div>
        <h2>{editingAgent ? 'Edit Agent' : 'Create New Agent'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Agent Name"
          value={editingAgent ? editingAgent.name : newAgent.name}
          onChange={handleInputChange}
        />
        <select
          name="status"
          value={editingAgent ? editingAgent.status : newAgent.status}
          onChange={handleInputChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {editingAgent ? (
          <button onClick={handleUpdateAgent}>Update Agent</button>
        ) : (
          <button onClick={handleCreateAgent}>Create Agent</button>
        )}
        {editingAgent && (
          <button onClick={() => setEditingAgent(null)}>Cancel</button>
        )}
      </div>

      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>
            {agent.name} - {agent.description}
            <button onClick={() => handleEditAgent(agent)}>Edit</button>
            <button onClick={() => handleDeleteAgent(agent.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Agents;