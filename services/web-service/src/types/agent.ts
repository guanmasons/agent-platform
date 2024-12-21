export interface Agent {
    agentId: string;
    agentName: string;
    userId: string; // to query agents under an user
    description: string;
    scope: string;
    oosAction: string;
    createdAt: number;
    updatedAt: number;
    url: string;
    mstpAddr: string;
  }