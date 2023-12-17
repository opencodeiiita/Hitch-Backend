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

## User Authentication

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

## Channels

### Create Channel

- **URL:** /api/channel/create/in/:id       -> MongooDB ID for workspace
- **Method:** POST
- **Authorized:** True
- **Request Body:**
  - **name:** String
  - **description:** String
  - **type:** String            -> This contains the values defined in enums > chanelType.enums.js
- **Success Status Code:** 201
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Channel Created Successfully",
        "data": {
            "name": String,
            "description": String,
            "workspaceId": String,
            "id": String,
        },
    }
    ```

### Update Channel

- **URL:** /api/channel/update/:id        -> MongooDB ID for channel
- **Method:** PUT
- **Authorized:** True
- **Request Body:**
  - **name:** String
  - **description:** String
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Channel Updated Successfully",
        "data": {
            "name": String,
            "description": String,
            "workspaceId": String,
            "id": String,
        },
    }
    ```

### Delete Channel

- **URL:** /api/channel/delete/:id        -> MongooDB ID for channel
- **Method:** DELETE
- **Authorized:** True
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Channel Deleted Successfully",
        "data": null,
    }
    ```

### Get Channels

- **URL:** /api/channel/get/:workspaceId
- **Method:** GET
- **Authorized:** True
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Channels Found",
        "data": [
            {
                "name": String,
                "description": String,
                "workspaceId": String,
                "id": String,
            },
        ]
    }
    ```

### Add user to channel

- **URL:** /api/channel/addUser/:id
- **Method:** POST
- **Authorized:** True
- **Request Body:**
  - **userId:** String
  - **role:** String
- **Success Status Code:** 201
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "User Added to Channel Successfully",
        "data": {
            "name": String,
            "description": String,
            "workspaceId": String,
            "id": String,
        },
    }
    ```

### Remove user from channel

- **URL:** /api/channel/removeUser/:id
- **Method:** DELETE
- **Authorized:** True
- **Request Body:**
  - **userId:** String
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "User Removed from Channel Successfully",
        "data": null,
    }
    ```

### Get users in channel

- **URL:** /api/channel/getUsers/:id
- **Method:** GET
- **Authorized:** True
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "Users Found",
        "data": [
            {
                "username": String,
                "email": String,
                "name": String,
                "id": String,
            },
        ]
    }
    ```

## SubChannels

### Create SubChannel

- **URL:** /api/subchannel/create/in/:id       -> MongooDB ID for channel
- **Method:** POST
- **Authorized:** True
- **Request Body:**
  - **name:** String
  - **description:** String
- **Success Status Code:** 201
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "SubChannel Created Successfully for channel {channel name}",
        "data": {
            "name": String,
            "description": String,
            "id": String,
        },
    }
    ```

### Update SubChannel

- **URL:** /api/subchannel/update/:id        -> MongooDB ID for subchannel
- **Method:** PUT
- **Authorized:** True
- **Request Body:**
  - **name:** String
  - **description:** String
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "SubChannel Updated Successfully",
        "data": {
            "name": String,
            "description": String,
            "id": String,
        },
    }
    ```

### Delete SubChannel

- **URL:** /api/subchannel/delete/:id        -> MongooDB ID for subchannel
- **Method:** DELETE
- **Authorized:** True
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "SubChannel Deleted Successfully",
        "data": null,
    }
    ```

### Get SubChannels

- **URL:** /api/subchannel/get/:id        -> MongooDB ID for channel
- **Method:** GET
- **Authorized:** True
- **Success Status Code:** 200
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "SubChannels Found",
        "data": [
            {
                "name": String,
                "description": String,
                "id": String,
            },
        ]
    }
    ```

## User

### Query User

- **URL:** /api/user/query  
- **Method:** GET
- **Authorized:** True
- **Success Status Code:** 200
- **Response Data:**
- **Query Parameters:**           -> Assume that the email or username is provided in partial form
  - **email:** String                and the server will return all the users which match the query
  - **username:** String             select the one whose either username or email matches the query
- **Response Data:**

    ```json
    {
        "status": 'OK',
        "message": "User Found",
        "data": [
            {
                "username": String,
                "email": String,
                "name": String,
                "id": String,
            },
        ]
    }
    ```
