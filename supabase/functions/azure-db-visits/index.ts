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

async function initializeVisitsTable(client: Client) {
  try {
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY,
        producto TEXT NOT NULL,
        client_name TEXT NOT NULL,
        numero_oportunidad TEXT,
        pais TEXT NOT NULL,
        consultor TEXT NOT NULL,
        hora TEXT NOT NULL,
        fecha TEXT NOT NULL,
        monto_oportunidad NUMERIC NOT NULL,
        activo BOOLEAN NOT NULL DEFAULT TRUE,
        fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Agregar columna activo si no existe (para migración de datos existentes)
    await client.queryArray(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='visits' AND column_name='activo'
        ) THEN
          ALTER TABLE visits ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;
        END IF;
      END $$;
    `);

    console.log('Tabla visits inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando tabla visits:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let client: Client | null = null;

  try {
    const { method, visitId, visitData } = await req.json();
    client = await getDbClient();
    
    await initializeVisitsTable(client);

    switch (method) {
      case 'GET_ALL': {
        const result = await client.queryObject(`
          SELECT * FROM visits WHERE activo = TRUE ORDER BY fecha_creacion DESC
        `);
        
        return new Response(JSON.stringify(result.rows), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'CREATE': {
        const { id, producto, clientName, numeroOportunidad, pais, consultor, hora, fecha, montoOportunidad } = visitData;
        
        await client.queryArray(
          `INSERT INTO visits (id, producto, client_name, numero_oportunidad, pais, consultor, hora, fecha, monto_oportunidad)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [id, producto, clientName, numeroOportunidad, pais, consultor, hora, fecha, montoOportunidad]
        );

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'UPDATE': {
        const { producto, clientName, numeroOportunidad, pais, consultor, hora, fecha, montoOportunidad } = visitData;
        
        await client.queryArray(
          `UPDATE visits 
           SET producto = $1, client_name = $2, numero_oportunidad = $3, pais = $4, 
               consultor = $5, hora = $6, fecha = $7, monto_oportunidad = $8
           WHERE id = $9`,
          [producto, clientName, numeroOportunidad, pais, consultor, hora, fecha, montoOportunidad, visitId]
        );

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        // Soft delete: marcar como inactivo en lugar de eliminar
        await client.queryArray(
          `UPDATE visits SET activo = FALSE WHERE id = $1`,
          [visitId]
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
    console.error('Error en azure-db-visits:', error);
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
