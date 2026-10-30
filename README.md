# Deploy a Node.js REST API to AWS EC2 with GitHub Actions

A Node.js REST API deployed to an AWS EC2 Ubuntu server with automated CI/CD using GitHub Actions, AWS Systems Manager, and OpenID Connect (OIDC).

This project demonstrates how to deploy and maintain a backend application on AWS, configure a reverse proxy, manage application processes, connect a cloud database, and automate deployments without storing permanent AWS credentials in GitHub.

## Architecture

```text
                     Developer
                         |
                         | Push to main
                         v
                  GitHub Repository
                         |
                         v
                   GitHub Actions
                         |
                  +------+------+
                  |             |
                  v             v
               CI Tests      AWS OIDC
               & Build           |
                                 v
                           AWS IAM Role
                                 |
                                 v
                        AWS Systems Manager
                                 |
                                 v
                            EC2 Instance
                           Ubuntu Server
                                 |
                          Git Pull & Build
                                 |
                                 v
                                PM2
                                 |
                                 v
                           Node.js API
                                 |
                                 v
                              Nginx
                                 |
                                 v
                            HTTP :80
                                 |
                                 v
                            API Clients

                         Node.js API
                              |
                              v
                         MongoDB Atlas
```

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- MongoDB Atlas
- Vitest
- Supertest

### AWS Infrastructure

- Amazon EC2 (Ubuntu)
- AWS IAM
- AWS Systems Manager (SSM)
- AWS CloudWatch / SSM Agent
- Nginx
- PM2

### CI/CD

- GitHub Actions
- GitHub Actions OIDC
- AWS IAM Roles
- AWS Systems Manager Run Command

## Features

- REST API built with Express.js and TypeScript.
- MongoDB Atlas database integration.
- Health check and database connectivity endpoints.
- Automated testing with Vitest and Supertest.
- TypeScript production build.
- EC2-based application hosting.
- PM2 process management.
- Nginx reverse proxy configuration.
- Automated CI pipeline with GitHub Actions.
- Automated EC2 deployment through AWS Systems Manager.
- Secure GitHub-to-AWS authentication using OIDC.
- Manual and automatic deployment options.

## API Endpoints

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | `/api/health`   | Check API health            |
| GET    | `/api/info`     | Get API information         |
| GET    | `/api/db-check` | Check database connectivity |

## Project Structure

```text
ec2-nodejs-deployment/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── aws-auth-test.yml
│       └── deploy.yml
│
├── src/
│   ├── routes/
│   ├── ...
│   └── server.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

_The source tree illustrates the main project layout. Refer to the repository for the complete implementation._

## Local Development

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account or a MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/HasarangaSam/ec2-nodejs-deployment.git

cd ec2-nodejs-deployment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

Configure your MongoDB connection string and other required application settings.

Never commit your `.env` file or database credentials.

### 4. Run the application

```bash
npm run dev
```

### 5. Run tests

```bash
npm test
```

### 6. Build the application

```bash
npm run build
```

## AWS EC2 Deployment

The application is hosted on an Ubuntu EC2 instance.

### Infrastructure Setup

1. Launch an Ubuntu EC2 instance.
2. Configure an EC2 security group.
3. Allow SSH access from your own IP address.
4. Allow HTTP traffic on port 80.
5. Connect to the instance using SSH.
6. Install Node.js, npm, Git, and Nginx.
7. Clone the application repository.
8. Install dependencies and build the application.
9. Configure production environment variables.
10. Start the application using PM2.

### PM2 Process Management

PM2 keeps the Node.js application running in the background.

```bash
pm2 start dist/server.js --name nodejs-api
```

Save the process list:

```bash
pm2 save
```

Useful commands:

```bash
pm2 status
pm2 logs nodejs-api
pm2 restart nodejs-api
pm2 stop nodejs-api
```

### Nginx Reverse Proxy

Nginx acts as a reverse proxy between incoming HTTP requests and the Node.js application.

```text
Client Request
      |
      v
Nginx (Port 80)
      |
      v
Node.js API (Port 3000)
```

The Node.js application listens on port 3000, while Nginx forwards public HTTP traffic from port 80 to the application.

Port 3000 does not need to be publicly exposed.

## CI/CD Pipeline

GitHub Actions automates testing, building, and deployment.

### Continuous Integration (CI)

The CI workflow runs when code is pushed to `main` or a pull request targets `main`.

It performs:

1. Checkout repository.
2. Set up Node.js.
3. Install dependencies using `npm ci`.
4. Run automated tests.
5. Build the TypeScript application.

Deployment is triggered only after the CI workflow completes successfully.

### Continuous Deployment (CD)

The deployment workflow uses GitHub Actions and AWS Systems Manager to update the EC2 instance.

Deployment process:

1. GitHub Actions authenticates with AWS using OIDC.
2. AWS IAM provides temporary credentials through an assumed role.
3. GitHub Actions sends a deployment command using AWS Systems Manager.
4. EC2 pulls the latest code from the `main` branch.
5. Dependencies are installed.
6. The application is built.
7. PM2 restarts the Node.js API.

The deployment can also be triggered manually from the GitHub Actions interface.

### Secure AWS Authentication with OIDC

Instead of storing permanent AWS access keys in GitHub Secrets, this project uses OpenID Connect.

The authentication flow:

```text
GitHub Actions
      |
      v
GitHub OIDC Token
      |
      v
AWS IAM Identity Provider
      |
      v
GitHub Deployment IAM Role
      |
      v
Temporary AWS Credentials
      |
      v
AWS Systems Manager
```

The IAM trust policy restricts access to the specified GitHub repository and branch using the repository's OIDC subject claim.

This allows GitHub Actions to authenticate with AWS without storing long-lived access keys.

### GitHub Repository Variables

Configure the following repository variables under:

**Settings → Secrets and variables → Actions → Variables**

| Variable          | Value / Description                                        |
| ----------------- | ---------------------------------------------------------- |
| `AWS_REGION`      | `ap-southeast-1`                                           |
| `AWS_ROLE_ARN`    | `arn:aws:iam::066899194881:role/GitHub-NodeJS-Deploy-Role` |
| `EC2_INSTANCE_ID` | Target EC2 instance ID                                     |

No permanent AWS access keys are required.

## Security Considerations

- SSH access is restricted to the developer's IP address.
- HTTP traffic is handled through Nginx.
- The Node.js application port is not publicly exposed.
- Production environment variables are kept outside the Git repository.
- EC2 uses a dedicated IAM role for Systems Manager.
- GitHub Actions uses OIDC instead of long-lived AWS access keys.
- The GitHub deployment role has restricted permissions for the target EC2 instance.
- Deployment is triggered only after successful CI checks.

## What I Learned

Through this project, I gained practical experience with:

- Deploying a Node.js application to AWS EC2.
- Managing Linux servers through SSH and AWS Systems Manager.
- Configuring Nginx as a reverse proxy.
- Managing Node.js processes using PM2.
- Connecting an application to MongoDB Atlas.
- Automating CI pipelines with GitHub Actions.
- Implementing continuous deployment with AWS Systems Manager.
- Understanding IAM roles, policies, and trust relationships.
- Configuring GitHub OIDC authentication with AWS.
- Deploying applications without storing permanent AWS credentials.

## Future Improvements

- Configure a custom domain.
- Enable HTTPS using Let's Encrypt and Certbot.
- Add application monitoring and alerting.
- Improve deployment health checks and rollback handling.
- Add deployment concurrency protection.

## Author

**Hasaranga Samarakoon**

GitHub: https://github.com/HasarangaSam

---

Built as a practical cloud deployment and DevOps learning project.
