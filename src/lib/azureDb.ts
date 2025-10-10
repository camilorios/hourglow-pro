const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface AzureProject {
  id: string;
  nombre: string;
  numero_oportunidad: string | null;
  pais: string;
  consultor: string;
  monto_oportunidad: number;
  fecha_creacion: string;
  terminado: boolean;
  observaciones?: Array<{ id: string; texto: string; fecha: string }>;
}

export interface AzureVisit {
  id: string;
  producto: string;
  client_name: string;
  numero_oportunidad: string | null;
  pais: string;
  consultor: string;
  hora: string;
  fecha: string;
  monto_oportunidad: number;
}

async function callEdgeFunction(functionName: string, body: any) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/${functionName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la llamada a la función');
  }

  return response.json();
}

// Projects API
export const projectsApi = {
  getAll: async (): Promise<AzureProject[]> => {
    return callEdgeFunction('azure-db-projects', { method: 'GET_ALL' });
  },

  create: async (projectData: {
    id: string;
    nombre: string;
    numeroOportunidad: string;
    pais: string;
    consultor: string;
    montoOportunidad: number;
    fechaCreacion: string;
  }): Promise<{ success: boolean }> => {
    return callEdgeFunction('azure-db-projects', {
      method: 'CREATE',
      projectData,
    });
  },

  update: async (
    projectId: string,
    projectData: {
      nombre: string;
      numeroOportunidad: string;
      pais: string;
      consultor: string;
      montoOportunidad: number;
      terminado: boolean;
    }
  ): Promise<{ success: boolean }> => {
    return callEdgeFunction('azure-db-projects', {
      method: 'UPDATE',
      projectId,
      projectData,
    });
  },

  addObservation: async (
    projectId: string,
    observation: {
      observationId: string;
      texto: string;
      fecha: string;
    }
  ): Promise<{ success: boolean }> => {
    return callEdgeFunction('azure-db-projects', {
      method: 'ADD_OBSERVATION',
      projectId,
      projectData: observation,
    });
  },

  delete: async (projectId: string): Promise<{ success: boolean }> => {
    return callEdgeFunction('azure-db-projects', {
      method: 'DELETE',
      projectId,
    });
  },
};

// Visits API
export const visitsApi = {
  getAll: async (): Promise<AzureVisit[]> => {
    return callEdgeFunction('azure-db-visits', { method: 'GET_ALL' });
  },

  create: async (visitData: {
    id: string;
    producto: string;
    clientName: string;
    numeroOportunidad: string;
    pais: string;
    consultor: string;
    hora: string;
    fecha: string;
    montoOportunidad: number;
  }): Promise<{ success: boolean }> => {
    return callEdgeFunction('azure-db-visits', {
      method: 'CREATE',
      visitData,
    });
  },

  update: async (
    visitId: string,
    visitData: {
      producto: string;
      clientName: string;
      numeroOportunidad: string;
      pais: string;
      consultor: string;
      hora: string;
      fecha: string;
      montoOportunidad: number;
    }
  ): Promise<{ success: boolean }> => {
    return callEdgeFunction('azure-db-visits', {
      method: 'UPDATE',
      visitId,
      visitData,
    });
  },

  delete: async (visitId: string): Promise<{ success: boolean }> => {
    return callEdgeFunction('azure-db-visits', {
      method: 'DELETE',
      visitId,
    });
  },
};
