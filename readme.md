# Ticketing System with Microservices

## Introduction

This project is a ticketing system with microservices. The project is developed with Node.js, Express.js, MongoDB, and NATS Streaming Server. The project is developed with microservices architecture. The project has 4 microservices. These are:

- Auth Service
- Ticket Service
- Order Service
- Expiration Service
  The project has a common library for common functions, which is used by all microservices. And also, the project has a NATS Streaming Server for event bus communication between microservices. The project is developed with TDD. The project has unit and integration tests for each microservice.

## Installation

First, clone the project:

```bash
git clone
```

Then, install the dependencies inside each microservice folder with the following command:

```bash
npm install
```

## Running the project

To run the project, you need to have Docker installed on your machine. Then, you can run the project with the following command:

```bash
skaffold dev
```

This command will create the necessary resources for the project and run the project.

## Kubectl environment variables

To run the project, you need to have the following environment variables in your kubectl configuration:

```bash
kubectl create secret generic jwt-secret --from-literal JWT_KEY=jwtKey
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=stripeKey
```

## Testing

To test the project, you can run the following command inside each microservice folder:

```bash
npm run test
```
