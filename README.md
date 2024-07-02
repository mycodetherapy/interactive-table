# Project interactive-table

## This is an example of saving table data to a database.

## Warning!!! The server API is built in such a way that the tables "mailing_gifts" and "mailings" are not aware of each other's existence. This can lead to data inconsistency errors in case of an error in one of the tables. Handling such cases is not configured on the client.

### If you want to work with the project locally:

1. You must have Node.js installed. You may need to downgrade to version 16.
2. You must have a MySQL server installed and running.
3. Clone the repository from the main branch to your device. To do this, type `git clone <repository address>` in the terminal.
4. The server must be accessible on localhost with the specified user and password. You can set your user and password at `server/src/config/db.ts`.
5. Go to the client folder and install the `npm install` dependencies.
6. Go to the server folder and install the `npm install` dependencies.
7. Start the server from the server folder `npm start`.
8. Start the client from the client `npm start` folder.
