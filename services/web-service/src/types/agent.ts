export interface Agent {
    id: string;
    name: string;
    userId: string;
    description: string;
    status: 'active' | 'inactive';
    scope: string;
    oosAction: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    mstpAddr: string;
}