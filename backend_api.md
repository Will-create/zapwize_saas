````markdown
# Backend API Specification for Zapwize SaaS (Total.js)

This document outlines the backend API endpoints and functionalities required for the Zapwize SaaS application, following the Total.js API structure. The primary focus is on the "Agents" feature.

## API Structure

All API requests are `POST` requests to the `/api/` endpoint. The specific operation is determined by a `schema` field within the JSON payload.

**General Request Format:**

```json
{
  "schema": "schema_name",
  "data": {
    //... payload data for the operation
  }
}
```

## Agent Data Model

The core data model for an "Agent" remains the same:

```json
{
  "id": "string", // Unique identifier for the agent
  "name": "string", // Name of the agent
  "type": "string", // Type of agent (e.g., 'sales', 'support')
  "status": "string", // Status of the agent: 'active', 'inactive', 'draft'
  "createdAt": "string" // ISO 8601 date-time string
}
```

### Agent Status Codes

-   `active`
-   `inactive`
-   `draft`

### Agent Type Codes

-   `sales`
-   `support`
-   `marketing`

## API Schemas for Agents

The following schemas are used for agent-related operations.

### 1. List Agents

-   **Schema:** `agents_list`
-   **Description:** Retrieves a list of all agents.
-   **Payload:** No data required.
-   **Example Request:**
    ```json
    {
      "schema": "agents_list"
    }
    ```
-   **Success Response (200 OK):** An array of agent objects.

### 2. Create Agent

-   **Schema:** `agents_create`
-   **Description:** Creates a new agent.
-   **Payload:**
    ```json
    {
      "name": "New Marketing Agent",
      "type": "marketing"
    }
    ```
-   **Example Request:**
    ```json
    {
      "schema": "agents_create",
      "data": {
        "name": "New Marketing Agent",
        "type": "marketing"
      }
    }
    ```
-   **Success Response (200 OK):** The newly created agent object.

### 3. Get Agent Details

-   **Schema:** `agents_read/{id}`
-   **Description:** Retrieves the details of a specific agent. The agent ID is part of the schema string.
-   **Payload:** No data required.
-   **Example Request:**
    ```json
    {
      "schema": "agents_read/agent-123"
    }
    ```
-   **Success Response (200 OK):** The requested agent object.

### 4. Update Agent

-   **Schema:** `agents_update/{id}`
-   **Description:** Updates the details of a specific agent.
-   **Payload:** An object containing the fields to update.
-   **Example Request:**
    ```json
    {
      "schema": "agents_update/agent-123",
      "data": {
        "name": "Updated Sales Bot Name"
      }
    }
    ```
-   **Success Response (200 OK):** The updated agent object.

### 5. Delete Agent

-   **Schema:** `agents_remove/{id}`
-   **Description:** Deletes a specific agent.
-   **Payload:** No data required.
-   **Example Request:**
    ```json
    {
      "schema": "agents_remove/agent-123"
    }
    ```
-   **Success Response (200 OK):** A confirmation object.

### 6. Toggle Agent Status

-   **Schema:** `agents_toggle_status/{id}`
-   **Description:** Toggles the status of an agent.
-   **Payload:** No data required.
-   **Example Request:**
    ```json
    {
      "schema": "agents_toggle_status/agent-123"
    }
    ```
-   **Success Response (200 OK):** The updated agent object.

## File Uploads

File uploads are handled by a separate service.

-   **Endpoint:** `https://fs.zapwize.com/upload/{userid}/`
-   **Method:** `POST`
-   **Query Parameters:**
    -   `token`: A valid authentication token.
-   **Request Body:** The file to be uploaded (e.g., as `multipart/form-data`).

This endpoint would be used for features like uploading files to the Knowledge Base.
````