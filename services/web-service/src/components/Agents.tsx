import React, { useState, useEffect } from 'react';
import { getAgentsByUserId, createAgent, updateAgent, deleteAgent } from '../services/api';
import keycloak from '../auth/keycloak';
import { Agent } from '../types/agent';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [newAgent, setNewAgent] = useState<Agent>({
    agentId: '',
    agentName: '',
    userId: '',
    description: '',
    scope: '',
    oosAction: '',
    createdAt: 0,
    updatedAt: 0,
    url: '',
    mstpAddr: '',
  });
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        if (!keycloak.token) {
          console.error('Access token is not available.');
          return;
        }
        const fetchedAgents = await getAgentsByUserId(keycloak.token);
        setAgents(fetchedAgents);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (editingAgent) {
      setEditingAgent({ ...editingAgent, [name]: value });
    } else {
      setNewAgent({ ...newAgent, [name]: value });
    }
  };

  const handleCreateAgent = async () => {
    try {
      const createdAgent = await createAgent(newAgent, keycloak.token!);
      setAgents([...agents, createdAgent]);
      setNewAgent({
        agentId: '',
        agentName: '',
        userId: '',
        description: '',
        scope: '',
        oosAction: '',
        createdAt: 0,
        updatedAt: 0,
        url: '',
        mstpAddr: '',
      });
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
  };

  const handleUpdateAgent = async () => {
    if (!editingAgent) return;
    try {
      const updatedAgent = await updateAgent(editingAgent, keycloak.token!);
      setAgents(agents.map((a) => (a.agentId === updatedAgent.agentId ? updatedAgent : a)));
      setEditingAgent(null);
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await deleteAgent(agentId, keycloak.token!);
      setAgents(agents.filter((a) => a.agentId !== agentId));
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  return (
    <div>
      <h1>Agents</h1>

      {/* Create Agent Form */}
      <div>
        <h2>{editingAgent ? 'Edit Agent' : 'Create New Agent'}</h2>
        <input
          type="text"
          name="agentName"
          placeholder="Agent Name"
          value={editingAgent ? editingAgent.agentName : newAgent.agentName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={editingAgent ? editingAgent.description : newAgent.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="scope"
          placeholder="Scope"
          value={editingAgent ? editingAgent.scope : newAgent.scope}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="oosAction"
          placeholder="Out of Scope Action"
          value={editingAgent ? editingAgent.oosAction : newAgent.oosAction}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="url"
          placeholder="URL"
          value={editingAgent ? editingAgent.url : newAgent.url}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="mstpAddr"
          placeholder="MSTP Address"
          value={editingAgent ? editingAgent.mstpAddr : newAgent.mstpAddr}
          onChange={handleInputChange}
        />
        {/* Add more input fields for other properties as needed */}
        {editingAgent ? (
          <button onClick={handleUpdateAgent}>Update Agent</button>
        ) : (
          <button onClick={handleCreateAgent}>Create Agent</button>
        )}
        {editingAgent && (
          <button onClick={() => setEditingAgent(null)}>Cancel</button>
        )}
      </div>

      {/* List of Agents */}
      <ul>
        {agents.map((agent) => (
          <li key={agent.agentId}>
            {agent.agentName} - {agent.description}
            <button onClick={() => handleEditAgent(agent)}>Edit</button>
            <button onClick={() => handleDeleteAgent(agent.agentId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Agents;