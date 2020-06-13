# Official repo of my personnal website

I'm trying new things with frontend / backend websites.

There's another repo with my first try at a backend API but I want to make it more clear and have the frontend in the same repo.

You can find the old repo [there](https://github.com/Laendrun/laendrun_api)

## To-Do

- [x] Build a base API
- [x] Learn how to make a correct error handler
- [x] Build an error handler
- [x] Return correct error messages / codes
- [x] Implement Email routes
    - [x] [POST /email/send]
        - [x] Call sendmail PHP API
    - [x] [POST /email/save]
        - [x] install mysql Node module
        - [x] connect to mysql database
        - [x] build the query wrapper to use queries asynchronously
- [ ] Implement auth routes
    - [x] [POST /auth/signup]
        - [x] connect to mysql database
        - [x] save users in the database
    - [ ] [POST /auth/login]
        - [x] validate user
        - [x] check if username in db
            - [x] compare password with hashed password
            - [x] create a JWT
            - [x] respond with JWT