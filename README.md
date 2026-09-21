# Challenges Evaluation Function

Servicio backend para gestionar evaluaciones de retos de programación, almacenar preguntas y resultados de ejecución, y validar código escrito en varios lenguajes dentro de contenedores Docker.

Este proyecto está desarrollado con Node.js, TypeScript y Express, y está pensado para trabajar con DynamoDB como almacenamiento principal y con ejecución aislada de código para evitar riesgos de seguridad.

## Objetivo

La aplicación permite:

- Crear y consultar evaluaciones (assessments).
- Crear y consultar preguntas (questions).
- Ejecutar código en JavaScript, Python y Java.
- Evaluar una pregunta individual frente a una solución.
- Evaluar un assessment completo con múltiples preguntas.
- Persistir resultados de evaluación.
- Exponer una API REST documentada con OpenAPI.

## Stack tecnológico

- Node.js
- TypeScript
- Express
- DynamoDB
- Docker
- AWS SDK v3
- Swagger / OpenAPI
- Mocha + Chai + Sinon para pruebas

## Estructura del proyecto

```bash
challenges-evaluation-function/
├── src/
│   ├── app.ts
│   ├── config.ts
│   ├── application/
│   │   ├── dto/
│   │   └── services/
│   ├── bin/
│   │   └── www.ts
│   ├── domain/
│   │   ├── assessments/
│   │   ├── evaluation/
│   │   ├── execution/
│   │   ├── questions/
│   │   └── submissions/
│   ├── infrastructure/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── execution/
│   │   ├── repositories/
│   │   └── routers/
│   └── shared/
│       ├── errors/
│       ├── middleware/
│       └── utils/
├── static/
│   └── OAS.json
├── build/
│   └── compilación de TypeScript
├── package.json
├── tsconfig.json
├── README.md
└── .env.example (si se agrega en local)
```

## Flujo principal

1. Se crea un assessment con varias preguntas.
2. El cliente envía una solución en un lenguaje soportado.
3. El servicio de ejecución prepara un contenedor Docker.
4. El código se guarda temporalmente en /tmp y se ejecuta.
5. Se captura stdout/stderr y se gestionan estados como:
   - SUCCESS
   - COMPILATION_ERROR
   - RUNTIME_ERROR
   - TIMEOUT
6. La evaluación se guarda y se devuelve con su resultado final.

## Requisitos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Node.js 18 o superior
- npm
- Docker
- Acceso a AWS o configuración local de DynamoDB

## Instalación

```bash
npm install
```

## Variables de entorno

El proyecto usa valores por defecto definidos en `src/config.ts`, pero en un entorno real es recomendable configurarlos con variables de entorno.

Ejemplo de configuración principal:

```bash
APPLICATION_PORT=8001
NODE_ENV=LOCAL
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
ASSESSMENTS_TABLE=tech-assess-assessments
QUESTIONS_TABLE=tech-assess-questions
CHALLENGE_EVALUATION=challenges-evaluation
BEDROCK_MODEL_ID=us.anthropic.claude-haiku-4-5-20251001-v1:0
EXECUTION_TIMEOUT_MS=5000
EXECUTION_MEMORY=128m
EXECUTION_CPU=0.5
EXECUTION_PIDS_LIMIT=50
```

## Comandos disponibles

```bash
npm run build
npm run start
npm run dev
npm test
npm run lint
```

### Descripción de scripts

- `npm run build`: compila TypeScript a JavaScript en la carpeta `build`.
- `npm run start`: compila y levanta la API.
- `npm run dev`: reinicia la API automáticamente en cambios locales.
- `npm test`: ejecuta cobertura y pruebas.
- `npm run lint`: valida estilo y sintaxis.

## Arranque del proyecto

```bash
npm run start
```

La API quedará disponible por defecto en:

```bash
http://localhost:8001
```

## Endpoints principales

### Assessments

- `POST /V1/assessments` - Crear un assessment
- `GET /V1/assessments/list` - Listar assessments
- `GET /V1/assessments/:id` - Obtener un assessment por id

### Questions

- `POST /V1/questions` - Crear una pregunta
- `GET /V1/questions/list` - Listar preguntas
- `GET /V1/questions/:id` - Obtener una pregunta por id

### Execution

- `POST /V1/execution` - Ejecuta código en un lenguaje soportado

### Evaluations

- `POST /V1/evaluation` - Evalúa una pregunta individual
- `POST /V1/evaluation/assessment` - Evalúa un assessment completo
- `GET /V1/evaluation/list` - Lista evaluaciones
- `GET /V1/evaluation/:id` - Obtiene una evaluación por id

### Submissions

- `POST /V1/submissions` - Gestiona envíos de soluciones

## Curls para pruebas locales

Estos ejemplos deben ejecutarse en este orden. Requieren la API levantada, DynamoDB configurado y `jq` instalado para reutilizar los IDs de las respuestas.

```bash
BASE_URL=http://localhost:8001

# 1. Registrar un candidato
curl -i -X POST "$BASE_URL/V1/auth/register" \
   -H 'Content-Type: application/json' \
   -d '{
      "name": "Candidate Local",
      "email": "candidate.local@example.com",
      "password": "Password123!",
      "userType": "candidate"
   }'

# 2. Iniciar sesión y copiar el token de data.token
curl -i -X POST "$BASE_URL/V1/auth/login" \
   -H 'Content-Type: application/json' \
   -d '{
      "email": "candidate.local@example.com",
      "password": "Password123!"
   }'

# También se puede guardar automáticamente el token
LOGIN_RESPONSE=$(curl -sS -X POST "$BASE_URL/V1/auth/login" \
   -H 'Content-Type: application/json' \
   -d '{"email":"candidate.local@example.com","password":"Password123!"}')
TOKEN=$(printf '%s' "$LOGIN_RESPONSE" | jq -r '.data.token')

# 3. Crear una pregunta. El ID se reutilizará para crear el assessment.
QUESTION_RESPONSE=$(curl -sS -X POST "$BASE_URL/V1/questions" \
   -H 'Content-Type: application/json' \
   -H "Authorization: Bearer $TOKEN" \
   -d '{
      "title": "Suma dos números",
      "description": "Lee dos números y muestra su suma.",
      "challengeType": "java",
      "allowedLanguages": ["javascript"],
      "score": 100,
      "testCases": [
         {
            "input": "2 3",
            "expectedOutput": "5",
            "hidden": false,
            "weight": 1
         }
      ]
   }')
QUESTION_DATA=$(printf '%s' "$QUESTION_RESPONSE" | jq -c '.data')
QUESTION_ID=$(printf '%s' "$QUESTION_DATA" | jq -r '.id')

# 4. Listar preguntas filtrando por tipo
curl -sS "$BASE_URL/V1/questions/list?challengeType=java" \
   -H "Authorization: Bearer $TOKEN"

# 5. Crear un assessment usando el questionId obtenido arriba
ASSESSMENT_RESPONSE=$(curl -sS -X POST "$BASE_URL/V1/assessments" \
   -H 'Content-Type: application/json' \
   -H "Authorization: Bearer $TOKEN" \
   -d "$(jq -n \
      --arg questionId "$QUESTION_ID" \
      '{name:"Assessment Java Local",description:"Assessment de prueba local",durationMinutes:30,questionIds:[$questionId]}')")
ASSESSMENT_ID=$(printf '%s' "$ASSESSMENT_RESPONSE" | jq -r '.data.id')

# 6. Ejecutar código directamente en Docker
curl -sS -X POST "$BASE_URL/V1/execution" \
   -H 'Content-Type: application/json' \
   -H "Authorization: Bearer $TOKEN" \
   -d '{
      "language": "javascript",
      "code": "const fs = require(\"fs\"); const [a, b] = fs.readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number); console.log(a + b);",
      "input": "2 3"
   }'

# 7. Evaluar la pregunta usando el objeto devuelto al crearla
curl -sS -X POST "$BASE_URL/V1/evaluation" \
   -H 'Content-Type: application/json' \
   -H "Authorization: Bearer $TOKEN" \
   -d "$(jq -n \
      --argjson question "$QUESTION_DATA" \
      '{question:$question,language:"javascript",code:"const fs = require(\\"fs\\"); const [a, b] = fs.readFileSync(0, \\"utf8\\").trim().split(/\\\\s+/).map(Number); console.log(a + b);"}')"

# 8. Evaluar el assessment completo
curl -sS -X POST "$BASE_URL/V1/evaluation/assessment" \
   -H 'Content-Type: application/json' \
   -H "Authorization: Bearer $TOKEN" \
   -d "$(jq -n \
      --arg assessmentId "$ASSESSMENT_ID" \
      --arg questionId "$QUESTION_ID" \
      '{assessmentId:$assessmentId,language:"javascript",codeByQuestion:{($questionId):"const fs = require(\\"fs\\"); const [a, b] = fs.readFileSync(0, \\"utf8\\").trim().split(/\\\\s+/).map(Number); console.log(a + b);"}}')"

# 9. Consultar evaluaciones persistidas
curl -sS "$BASE_URL/V1/evaluation/list" \
   -H "Authorization: Bearer $TOKEN"
```

La respuesta de login tiene el token en `data.token`; las respuestas de creación de preguntas y assessments tienen sus identificadores en `data.id`. Si se repite el registro, debe cambiarse el email porque el endpoint devuelve `409` para usuarios existentes.

## Documentación OpenAPI

La API incluye un archivo OpenAPI en:

```bash
static/OAS.json
```

Y la documentación Swagger se configura con la ruta:

```bash
/api-docs
```

## Ejecución de código

El motor de ejecución usa Docker para aislar la ejecución de cada solución. Actualmente soporta:

- JavaScript -> `node:22-alpine`
- Python -> `python:3.12-alpine`
- Java -> `eclipse-temurin:21-jdk-alpine`

La ejecución incluye:

- creación de contenedor con nombre aleatorio
- escritura del código en `/tmp`
- red sin acceso de red (`--network none`)
- límites de memoria, CPU y procesos
- timeout configurable
- limpieza automática del contenedor

## Estado de errores

El motor de ejecución clasifica los resultados en:

- `SUCCESS`: ejecución correcta
- `COMPILATION_ERROR`: hay error de compilación
- `RUNTIME_ERROR`: ejecuta pero falla en tiempo de ejecución
- `TIMEOUT`: excede el tiempo permitido
