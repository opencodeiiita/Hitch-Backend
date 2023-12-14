# API EndPoints

A successful response from the server will look like this:

```json
{
  "status": "OK",
  "message": "Message for the developer",
  "data": {
    "All the data from server will be here"
  }
}
```

An error response from the server will look like this:

```json
{
  "status": "error",
  "error": "Error Message for the developer",
}
```

>Note: You can use the response functions peovided in the `utils/responseCode.utils.js` file to send the response from the server.

The following properties of every endpoint will be descibed in this file:

- **Method**: GET | POST | PATCH | DELETE
- **Authorized**: (Authentication is required or not for this route) True | False
- **Verified**: (Account with Email verified is required or not for this route) True | False
- **Request Parameters**: (Requet-Body to be sent along with the request, for POST | PATCH | DELETE methods)
- **Query Parameters**: (Query Parameters available in GET requests to manipulate the response from the server)
- **Success Status Code**: (Status Code of a successful response) 2xx
- **Response Data**: (The format of data which is expected from the server with a successful response)

## User

### Register

- **URL:** /api/user/register
- **Method:** POST
- **Request Body:**
  - **username:** String
  - **password:** String
  - **email:** String
  - **name:** String
- **Success Status Code:** 201
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "User Registered Successfully",
        "data": {
            "username": String,
            "email": String,
            "name": String,
            "id": String,
            "token": String
        },
    
    }
    ```

### Login

- **URL:** /api/user/login
- **Method:** POST
- **Request Body:**
  - **email:** String
  - **password:** String
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "User Logged In Successfully",
        "data": {
            "username": String,
            "email": String,
            "name": String,
            "id": String,
            "token": String
        },
    
    }
    ```

### Logout

- **URL:** /api/user/logout
- **Method:** POST
- **Authorized:** True
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "User Logged Out Successfully",
        "data": null,
    }
    ```

### Create Workspace

- **URL:** /api/workspace/create
- **Method:** POST
- **Authorized:** True
- **Request Body:**
  - **userId:** userId            -> This is the id of the user who is creating the workspace
  - **name:** String
  - **description:** String
  - **workspaceId:** String     -> This is like username for workspace
- **Success Status Code:** 201
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Workspace Created Successfully",
        "data": {
            "name": String,
            "description": String,
            "workspaceId": String,
            "id": String,
        },
    }
    ```

### Update Workspace

- **URL:** /api/workspace/update/:id        -> MongooDB ID for workspace
- **Method:** PUT
- **Authorized:** True
- **Request Body:**
  - **userId:** userId              -> This is the id of the user who is signed in.
  - **name:** String                   So needed to verify that the user is the creator of the workspace
  - **description:** String
  - **workspaceId:** String         -> This is like username for workspace
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Workspace Updated Successfully",
        "data": {
            "name": String,
            "description": String,
            "workspaceId": String,
            "id": String,
        },
    }
    ```

### Delete Workspace

- **URL:** /api/workspace/delete/:id        -> MongooDB ID for workspace
- **Method:** DELETE
- **Authorized:** True
- **Request Body:**
  - **userId:** userId              -> This is the id of the user who is signed in.
                                       So needed to verify that the user is the creator of the workspace
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Workspace Deleted Successfully",
        "data": null,
    }
    ```
