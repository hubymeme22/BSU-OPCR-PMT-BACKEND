# BSU-OPCR-PMT-BACKEND
This API is the continuation of the [OPCR Back-end project](https://github.com/hubymeme22/BSU-OPCR-System-Backend), but focuses on creation and calibration of opcr. The system has three (3) accounts: admin, head, and pmt accounts. **Admin** account is responsible for encoding campuse and its offices, and assigning the head to the encoded office and pmt accounts to assigned campus, **PMT** accounts are responsible for calibration of opcr encoded, and lastly, the **Head** accounts are responsible for encoding and creating the opcr. The goal of this API is to provide the functionalities and necessary computation the above mentioned flow.

This repository will be used to track our progress in our system's back-end.

<br>

# Installation and Setup
## Setting up configuration
The `.env` file contains different values and by default are set by the developer's database link (which does not work, since this mongoose link is only white listed to developer's access), localhost as ip address and so on. The `.env` file has the following variables that can be changed anytime for easier configuration:
- `IP` - The IP address that will be used by the API.
- `PORT` - The PORT that will be used by the API (set this to `80` to avoid typing the port alongside the ip).
- `MONGODB_URI` - The URI that will be used to connect to your mongodb atlas server.
- `SECRET_KEY` - The `salt` that will be used for encoding your `jsonwebtoken` and  **CHANGING THIS IS ONE A MUST** when deploying the application to production for security purposes.
- `LOGGER` - The type of Logging that will be used when running the server (by default is set to `normal`).
<br>

## Package installation and starting the server
This project uses the following npm packages:
- `express` - package used for RESTful API framework.
- `mongoose` - used for connecting to the database.
- `cookie-parser` - used for parsing cookies from header.
- `dotenv` - for easier configuration by accessing the `.env` file.

The packages mentioned above will be installed by executing the ff. command on terminal:

```
npm install
```

After installing the packages, access and run the API by executing the ff. command:
```
npm run server
```

**Note**: Make sure that you whitelisted your IP from your mongodb atlas' access to avoid errors.

<br>

# API Routes
This section contains the api routes, methods, definition and their functionalities.

<br>

## Admin permission routes
These routes are routes that can only be accessed by the admin.

<br>

### **Account registration**
- This route registers a new account, which can be either `head` or `pmt` account.
- The route path varies depending on account that will be registered:
  - Registration of `head` account:

    ```
    POST /register/head

    {
        "username": "...",
        "password": "..."
    }
    ```

  - Registration of `pmt` account:
    ```
    POST /register/pmt

    {
        "username": "...",
        "password": "..."
    }
    ```
- The API will return a json response format:
  ```json
  { "registered": true, "error": null }
  ```

<br>

### **Account retrieval**
- This route retrieves all the account that the admin registered. This will be used for assigning a specific account to a campus / campus & office.
- The route path also varies depending on the type of account that will be retrieved:
  - `head` account retrieval:
    ```
    GET /api/admin/read/account/head
    ```
  - `pmt` account retrieval:
    ```
    GET /api/admin/read/account/pmt
    ```

- The api will return the following json response format:
  ```json
  {
    "accounts": [
        {
            "_id": "644aabd9dc89ab4730838038",
            "username": "samplepmt",
            "password": "xxxxxxxx",
            "access": "pmt",
            "__v": 0,
            "campusAssigned": "644aabcfdc89ab473083802f"
        }
    ],
    "error": null
  }
  ```
- The json response returns a `accounts` field which is an array of account object that contains basic account information.

<br>

### **Campus and department retrieval**
- This route retrieves all the campuses added by the `admin`:
  ```
  GET /api/admin/read/campus
  ```
- The server returns the following json response format:
  ```json
  {
    "campus": [
        {
            "_id": "644aabcfdc89ab473083802f",
            "campusName": "Alangilan",
            "departments": [
                {
                    "name": "COE",
                    "_id": "644aabcfdc89ab4730838031",
                    "opcr": []
                },
                {
                    "name": "CEAFA",
                    "_id": "644aabcfdc89ab4730838032",
                    "opcr": []
                }
            ],
            "__v": 2
        }
    ],
    "error": null
  }
  ```
- This json response contains a detailed information about the campuses, its departments, and the individual departments' opcr (if there's any).

<br>

## PMT permission routes
These routes are the routes that performs the tasks of PMTs.

<br>

`...`

## Head permission routes
These routes are the routes that performs that tasks of office heads.

<br>

`...`