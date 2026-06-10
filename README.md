# Hono API Starter
This is a REST API template for Hono. Developers spend alot of time writing boilerplate code. This template handles the initial heavy lifting so hono devs can focus strictly on the application logic.
## The Branching Strategy (Important)
There are two main branches here. **Do not try to merge them.** They will conflict. Just pick the one that fits your project and start building.
 * **main branch:** This has everything setup: Better Auth, BullMQ workers, AWS S3/Cloudflare R2 storage integration, user profile management, contact forms, and a newsletter module.
 * **starter branch:** Barebones. It gives you the core folder structure, a few modules, Drizzle setup, and OpenAPI routing.
### Roadmap: The CLI
Right now, you just clone the branch you want. Eventually, there will be a dedicated CLI tool to handle this. You will be able to start with the barebones branch and just run something like ``pnpm cli add upload`` to scaffold either a pre-built module or an empty boilerplate module. Work on the CLI hasn't started yet, but it is the end goal.
## Tech Stack
 * **Core:** Hono (Node.js adapter)
 * **Database:** PostgreSQL (Neon) via Drizzle ORM
 * **Validation & Docs:** Zod, @hono/zod-openapi, Scalar API Reference
 * **Authentication:** Better Auth (Cookie-based, RBAC)
 * **Jobs/Queues:** BullMQ + Redis
 * **Emails:** Resend + React Email
 * **Testing:** Vitest + Hono testClient
## Folder Structure
The code is split into domain-specific modules.
```text
src/
├── core/                  # Database connections, Redis, jobs, and global middleware
├── modules/               # The actual features
│   ├── admin/             # Role management and invites
│   ├── auth/              # Better Auth setup
│   ├── contact/           # Form submissions
│   ├── health/            # System and Redis status checks
│   ├── newsletter/        # Subscriber management
│   ├── upload/            # (main branch only) S3/R2 direct uploads
│   └── users/             # (main branch only) Profile updates and deletion
└── index.ts               # The server entry point

```
## Getting Started
 1. Clone the repo:
```bash
git clone https://github.com/justinedoc/hono-api-starter.git my-api
cd my-api

```
 2. Install dependencies:
```bash
pnpm install

```
 3. Setup environment variables:
```bash
cp .env.example .env

```
Fill out the .env file. The app runs a strict Zod check on boot. If you miss a required variable, the server will crash immediately and tell you what is missing.
 4. Push the schema to your database:
```bash
pnpm run db:push

```
 5. Start the server:
```bash
pnpm run dev

```
Check http://localhost:3000/docs to see the generated OpenAPI specs.
## A Warning About Hosting
This app uses BullMQ to handle background tasks like sending emails. BullMQ requires a continuously running Node.js event loop to listen to Redis.
**Do not deploy this to Vercel or standard serverless functions.** The platform will kill your worker thread the second the HTTP response is sent, and your emails will never go out. Host this on a VPS (like Hetzner) or a container platform (like Koyeb, Render, or Railway) so the workers stay alive.
## Testing
Do not run tests against your development database. The tests write and delete actual records.
 1. Create a .env.test file.
 2. Provide a completely isolated test database URL (for example, create a new branch in Neon).
 3. Run the test suite:
```bash
pnpm test

```
The test script automatically runs drizzle-kit push against your test database before executing Vitest. It uses Hono's testClient to hit your endpoints in-memory, while things like Redis and Resend are globally mocked in vitest.setup.ts.
## Contributing
Contributors are welcome. If you are adding a feature, keep it modular and write integration tests for your endpoints.
We use Conventional Commits. Please format your commit messages accordingly:
 * feat: added the new user profile route
 * fix: resolved the split key bug in the upload module
 * refactor: cleaned up the email worker logic
## License
MIT
