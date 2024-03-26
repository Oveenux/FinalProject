import mysql.connector
import random
import time

def conectar(authentication):
    try:
        # Start the MySQL database connection.
        connection2db = mysql.connector.connect(authentication)
        print('Successful connection to the database')
        return connection2db
    except mysql.connector.Error as error:
        print(f'Failed connection to database: \n {error}')
        return None

def generar_datos():
    while True:
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        tempExt = random.randint(25,35)
        tempNev = random.randint(1,5)  # Simulación de datos de temperatura
        humedadExt = random.randint(50,59)
        humedadNev = random.randint(73,89)
        luminosidad = random.randint(30,80)
        viento = random.randint(13,18)
        yield f"data: {timestamp} {tempExt} {tempNev} {humedadExt} {humedadNev} {luminosidad} {viento}\n\n"
        time.sleep(5)  # Enviar datos cada 5 segundos