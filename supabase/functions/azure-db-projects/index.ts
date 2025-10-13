import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getDbClient() {
  const client = new Client({
    hostname: Deno.env.get('AZURE_DB_HOST'),
    port: parseInt(Deno.env.get('AZURE_DB_PORT') || '5432'),
    user: Deno.env.get('AZURE_DB_USER'),
    password: Deno.env.get('AZURE_DB_PASSWORD'),
    database: Deno.env.get('AZURE_DB_NAME'),
    tls: {
      enabled: true,
      enforce: false,
      caCertificates: []
    }
  });
  
  console.log('Intentando conectar a Azure DB...');
  await client.connect();
  console.log('Conexión exitosa a Azure DB');
  return client;
}

async function initializeTables(client: Client) {
  try {
    // Crear tabla de proyectos si no existe
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        numero_oportunidad TEXT,
        pais TEXT NOT NULL,
        consultor TEXT NOT NULL,
        monto_oportunidad NUMERIC NOT NULL,
        fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
        terminado BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);

    // Crear tabla de observaciones si no existe
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS observaciones (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        texto TEXT NOT NULL,
        fecha TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log('Tablas inicializadas correctamente');
  } catch (error) {
    console.error('Error inicializando tablas:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let client: Client | null = null;

  try {
    const { method, projectId, projectData } = await req.json();
    client = await getDbClient();
    
    // Inicializar tablas en la primera ejecución
    await initializeTables(client);

    switch (method) {
      case 'GET_ALL': {
        const result = await client.queryObject(`
          SELECT p.*, 
            COALESCE(
              json_agg(
                json_build_object(
                  'id', o.id,
                  'texto', o.texto,
                  'fecha', o.fecha
                )
                ORDER BY o.fecha DESC
              ) FILTER (WHERE o.id IS NOT NULL),
              '[]'
            ) as observaciones
          FROM projects p
          LEFT JOIN observaciones o ON p.id = o.project_id
          WHERE p.terminado = FALSE
          GROUP BY p.id
          ORDER BY p.fecha_creacion DESC
        `);
        
        return new Response(JSON.stringify(result.rows), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'CREATE': {
        const { id, nombre, numeroOportunidad, pais, consultor, montoOportunidad, fechaCreacion } = projectData;
        
        await client.queryArray(
          `INSERT INTO projects (id, nombre, numero_oportunidad, pais, consultor, monto_oportunidad, fecha_creacion, terminado)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [id, nombre, numeroOportunidad, pais, consultor, montoOportunidad, fechaCreacion, false]
        );

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'UPDATE': {
        const { nombre, numeroOportunidad, pais, consultor, montoOportunidad, terminado } = projectData;
        
        await client.queryArray(
          `UPDATE projects 
           SET nombre = $1, numero_oportunidad = $2, pais = $3, consultor = $4, 
               monto_oportunidad = $5, terminado = $6
           WHERE id = $7`,
          [nombre, numeroOportunidad, pais, consultor, montoOportunidad, terminado, projectId]
        );

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'ADD_OBSERVATION': {
        const { observationId, texto, fecha } = projectData;
        
        await client.queryArray(
          `INSERT INTO observaciones (id, project_id, texto, fecha)
           VALUES ($1, $2, $3, $4)`,
          [observationId, projectId, texto, fecha]
        );

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        // Soft delete: marcar como terminado en lugar de eliminar
        await client.queryArray(
          `UPDATE projects SET terminado = TRUE WHERE id = $1`,
          [projectId]
        );

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Método no válido' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error en azure-db-projects:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
});
