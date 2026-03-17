# Archivo historico de cancer de mama

Plataforma colaborativa para una investigacion cientifica sobre la historia del cancer de mama antes de 1900. El foco del proyecto es:

- localizar todos los archivos del corpus donde aparezcan menciones relevantes;
- comparar coincidencias entre terminos, variantes, documentos, decadas y contextos;
- permitir que Eva y la comunidad agreguen nuevos terminos y nuevos documentos;
- vectorizar el corpus para comparar fragmentos contextualmente similares.

## Lo que ya hace

- corpus semilla cargado desde `src/data/records.json`;
- lexico configurable con terminos canonicos, variantes y notas metodologicas;
- deteccion de menciones en todos los documentos disponibles;
- coocurrencias por fragmento y cronologia por decada;
- comparacion contextual por TF-IDF tanto desde una mencion detectada como desde un fragmento pegado manualmente;
- formulario unico para cargar nuevas fuentes con metadatos, OCR y archivo adjunto;
- capa de prospeccion con documentos ya localizados pero todavia no curados en el corpus principal;
- visualizaciones D3 responsivas, movibles y con red draggable.

## Comandos

```bash
npm install
npm run download:sources
npm run build
npm run server
```

Para desarrollo de frontend con proxy a la API:

```bash
npm run dev
```

## Docker

```bash
docker compose up --build -d
```

La plataforma queda disponible en `http://localhost:4173`.

Los datos persistentes viven en `runtime-data/` y se montan como volumen dentro del contenedor.

## CI/CD con Gitea + Drone

El despliegue pensado para `eva.hadox.org` usa:

- Gitea como origen git;
- Drone para validacion y despliegue;
- `deploy@191.101.233.39` como destino;
- `docker compose` en `/home/deploy/eva.hadox.org`.

Archivos relevantes:

- `.drone.yml`: pipeline de validacion y deploy;
- `scripts/drone_deploy.sh`: despliegue remoto en `srv566867`.

La pipeline hace esto:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `rsync` del repo al VPS sin tocar `runtime-data/`
5. `docker compose -f compose.hostinger.yaml build --pull archive`
6. `docker compose -f compose.hostinger.yaml up -d --remove-orphans archive`

### Secreto requerido en Drone

Crear un secreto de repositorio llamado `EVA_DEPLOY_SSH_KEY` con la llave privada que ya entra como `deploy` a `191.101.233.39`.

### Alta sugerida en Gitea

Ejemplo de remoto SSH:

```bash
git init -b main
git remote add origin ssh://git@git.hadox.org:2222/hadoxmin/eva-hadox-org.git
git add .
git commit -m "Initial eva archive platform"
git push -u origin main
```

### Alta sugerida en Drone

1. Sincronizar repositorios en `https://drone.hadox.org`
2. Activar el repo de `eva`
3. Agregar el secreto `EVA_DEPLOY_SSH_KEY`
4. Hacer push a `main`

Si quieres automatizar tambien la creacion del repo en Gitea y el alta de secretos en Drone, ahi si necesito token API de Gitea y/o Drone.

## Estructura

- `server/index.mjs`: API Express y entrega del frontend compilado.
- `server/analysis.mjs`: menciones, coocurrencias y comparacion vectorial.
- `server/store.mjs`: persistencia local de terminos, documentos y uploads.
- `src/App.jsx`: tablero principal de investigacion.
- `src/data/discoveredDocuments.js`: fuentes nuevas rastreadas para prospeccion.
- `src/components/`: visualizaciones D3.
- `src/data/records.json`: corpus semilla.
- `public/raw/ocr/`: OCR locales descargados.
- `runtime-data/`: terminos editados, documentos cargados y archivos subidos.

## API principal

- `GET /api/state`: estado del corpus, terminos y analisis agregado.
- `POST /api/terms`: agrega un termino nuevo.
- `PUT /api/terms/:termId`: actualiza un termino existente.
- `POST /api/documents`: agrega un documento al corpus.
- `GET /api/similar-contexts/:mentionId`: vecinos contextuales desde una mencion.
- `POST /api/context-query`: vecinos contextuales desde un fragmento pegado.

## Siguiente iteracion sugerida

1. embeddings multilingues reales para espanol, frances e ingles;
2. entidades historicas: personas, hospitales, ciudades, oficios y tratamientos;
3. importacion masiva CSV/JSON para lotes de documentos;
4. revision editorial por estados y trazabilidad de cambios;
5. exportacion de reportes curados por dossier o pregunta historiografica.
