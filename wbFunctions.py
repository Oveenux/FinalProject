import mysql.connector

def conectar(hostdb, userdb, passwordb, principal_db):
    try:
        # Start the MySQL database connection.
        connection2db = mysql.connector.connect(
            host = hostdb,
            user = userdb,
            password = passwordb,
            database = principal_db
        )
        print('Successful connection to the database')
        return connection2db
    except mysql.connector.Error as error:
        print(f'Failed connection to database: \n {error}')
        return None

