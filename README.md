# MODO AVIÓN — E-commerce Single-Product Landing + Admin

Landing page de producto único y panel de administración para la marca
**MODO AVIÓN**, construido con **Django REST Framework + PostgreSQL** en el
backend y **React (Vite) + Tailwind CSS** en el frontend.

Producto principal: **KIT MODO AVIÓN — $20.000 CLP**, con sus 6 componentes
disponibles también de forma individual.

---

## Estructura del proyecto

```
modo-avion-project/
├── backend/                  # Django + DRF
│   ├── venv/                 # entorno virtual (no se commitea)
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── core/                 # settings, urls, wsgi/asgi
│   └── apps/
│       ├── authentication/   # Firebase middleware + views
│       ├── products/         # catálogo + seed data
│       └── orders/           # checkout atómico
└── frontend/                 # React (Vite) + Tailwind
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── assets/
        ├── components/       # Navbar, ProductCard, DynamicGrid, Footer
        ├── context/          # AuthContext
        ├── hooks/            # useCart, useFetch, format
        ├── services/         # api.js, firebase.js
        └── views/            # LandingPage, Shop, KitPage, ProductDetail, Checkout, Dashboard, Login, Register, Contacto
```

---

## 1 · Backend — Setup

### 1.1 Crear y aislar el entorno virtual

```bash
cd backend
python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

> Cada vez que abras una terminal nueva para trabajar en el backend, vuelve
> a activar el venv con `source venv/bin/activate`.

### 1.2 Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 1.3 Crear la base de datos PostgreSQL

Conéctate como superusuario de PostgreSQL y crea el usuario + la base:

```bash
sudo -u postgres psql
```

Dentro de la consola de `psql`:

```sql
CREATE USER modoavion_user WITH PASSWORD 'modoavion_password';
CREATE DATABASE modoavion_db OWNER modoavion_user;
GRANT ALL PRIVILEGES ON DATABASE modoavion_db TO modoavion_user;
\q
```

> Si tu `postgres` local no requiere `sudo -u`, usa directamente `psql -U postgres`.

### 1.4 Variables de entorno

```bash
cp .env.example .env
```

Edita `backend/.env` con tus credenciales reales:

```env
SECRET_KEY=tu-clave-secreta-larga-y-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=modoavion_db
DB_USER=modoavion_user
DB_PASSWORD=modoavion_password
DB_HOST=127.0.0.1
DB_PORT=5432

# Ruta al JSON de la service account de Firebase Admin.
# (Se descarga desde Firebase Console → Project Settings → Service Accounts)
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

> ⚠️ **Nunca** commitees `firebase-service-account.json` ni el archivo `.env`.
> Ambos están en `.gitignore`.

### 1.5 Migraciones y datos semilla

```bash
python manage.py makemigrations
python manage.py migrate
```

El data migration `apps/products/migrations/0002_seed_products.py` deja el
catálogo listo (KIT + 6 productos individuales) automáticamente. Si necesitas
re-poblar a mano más adelante:

```bash
python manage.py seed_products
```

### 1.6 Crear superusuario (opcional — admin de Django)

```bash
python manage.py createsuperuser
```

### 1.7 Levantar el servidor

```bash
python manage.py runserver
```

Backend corriendo en: **http://localhost:8000**

- Admin: `http://localhost:8000/admin/`
- Health: `http://localhost:8000/api/health/`
- Productos: `http://localhost:8000/api/products/`
- Órdenes (requiere auth): `http://localhost:8000/api/orders/`

---

## 2 · Frontend — Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edita `frontend/.env` con la config de tu Firebase Web SDK (la obtienes en
**Firebase Console → Project Settings → Your apps → Config**):

```env
VITE_API_URL=/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Levantar el dev server:

```bash
npm run dev
```

Frontend corriendo en: **http://localhost:5173**

> El frontend habla con el backend en `/api/*`, que Vite proxia
> automáticamente a `http://localhost:8000` (ver `vite.config.js`).

---

## 3 · Endpoints principales

| Método | Endpoint                 | Auth      | Descripción                                 |
|--------|--------------------------|-----------|---------------------------------------------|
| GET    | `/api/products/`         | Pública   | Lista productos activos + estado de stock   |
| GET    | `/api/products/<slug>/`  | Pública   | Detalle de un producto                      |
| POST   | `/api/orders/`           | Bearer    | Crea pedido atómico (decrementa stock)      |
| GET    | `/api/orders/`           | Bearer    | Lista pedidos del usuario actual            |
| GET    | `/api/orders/<id>/`      | Bearer    | Detalle de un pedido                        |
| GET    | `/api/auth/whoami/`      | Bearer    | Devuelve el usuario Django resuelto         |
| POST   | `/api/auth/sync-profile/`| Bearer    | Sincroniza first/last name desde el cliente |

> El header de auth es `Authorization: Bearer <Firebase_ID_Token>`.

---

## 4 · Flujo de Git Commit (Protocolo)

Cada vez que completes un cambio mayor — nuevo endpoint, migración de
schema, cambio de UI, fix importante — sigue este protocolo al pie de la
letra. La idea: **commitea apenas termines y verifiques**, no al final del día.

### 4.1 Inicializar el repositorio (una sola vez)

```bash
cd modo-avion-project
git init
git branch -M main
git add .
git commit -m "chore: scaffold MODO AVIÓN project (Django + Vite/React)"
```

### 4.2 Convención de mensajes (Conventional Commits)

| Prefijo      | Cuándo usarlo                                      |
|--------------|----------------------------------------------------|
| `feat:`      | Nueva funcionalidad visible (endpoint, vista)      |
| `fix:`       | Bug fix                                            |
| `chore:`     | Config, deps, scaffolding, sin cambio funcional   |
| `refactor:`  | Cambio interno sin cambio de comportamiento        |
| `docs:`      | README, comentarios, docs                         |
| `style:`     | Sólo formato (Tailwind, identación)                |
| `test:`      | Añadir o arreglar tests                            |
| `db:`        | Migraciones o cambios de schema                    |

### 4.3 Workflow de cada cambio

```bash
# 1) Crear rama con prefijo del tipo de cambio
git checkout -b feat/checkout-stepper

# 2) Trabajar, guardar, verificar que compila
#    Backend:
cd backend && source venv/bin/activate
python manage.py check
python manage.py makemigrations  # si tocaste models
python manage.py migrate
#    Frontend:
cd ../frontend && npm run build

# 3) Stage + commit con mensaje descriptivo
cd ..
git add .
git commit -m "feat(checkout): add 4-step stepper and confirmation view"

# 4) Merge a main cuando esté aprobado
git checkout main
git merge --no-ff feat/checkout-stepper

# 5) Push
git push origin main
```

### 4.4 Snippet para migrations de schema

```bash
cd backend && source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
cd ..
git add backend/apps/*/migrations/
git commit -m "db(orders): add shipping_region and customer_phone"
```

### 4.5 Reglas

1. **Commits atómicos**: un commit = un cambio lógico testeable.
2. **Nunca** commitear `.env`, `firebase-service-account.json` ni
   `venv/`, `node_modules/`, `dist/`. El `.gitignore` ya los excluye.
3. **Migrations siempre versionadas**: cualquier `makemigrations` debe
   ir commiteado en el mismo commit que el cambio de modelo.
4. **Build verde antes de commit**: `python manage.py check` y
   `npm run build` deben pasar limpios.
5. **Pull requests con descripción**: qué, por qué, cómo probarlo.

---

## 5 · Stack resumido

| Capa        | Tecnología                                                |
|-------------|-----------------------------------------------------------|
| Frontend    | React 18 + Vite 5 + Tailwind CSS 3 + React Router 6       |
| Auth FE     | Firebase Web SDK (`firebase/auth`)                        |
| Backend     | Django 5 + Django REST Framework 3.15                     |
| Auth BE     | Firebase Admin SDK (verificación de ID token)            |
| DB          | PostgreSQL vía `psycopg2-binary`                          |
| Env         | `python-decouple` para `.env`                             |
| Concurrencia| `transaction.atomic` + `select_for_update` en checkout    |
| Dev         | Vite proxy `/api` → Django en `:8000`                     |

---

## 6 · Comandos rápidos (TL;DR)

```bash
# --- Backend ---
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # editar credenciales
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

# --- Frontend (en otra terminal) ---
cd frontend
npm install
cp .env.example .env             # editar credenciales Firebase
npm run dev
```

Listo. Abre `http://localhost:5173` y a volar.
