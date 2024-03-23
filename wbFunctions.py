import mysql.connector


def conectar(authentication):
    try:
        # Start the MySQL database connection.
        connection2db = mysql.connector.connect(authentication)
        print('Successful connection to the database')
        return connection2db
    except mysql.connector.Error as error:
        print(f'Failed connection to database: \n {error}')
        return None

