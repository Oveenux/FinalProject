from access_config.DB_Access import authentication
from flask import jsonify
import mysql.connector
import random
import time

def conectar():
    try:
        # Start the MySQL database connection.
        connection2db = mysql.connector.connect(**authentication)
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

def get_data():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        # Consulta para obtener los últimos 10 datos
        sql = "SELECT TIMESTAMP, TEMP, TEMPNEV, HUM, HUMNEV, LUX FROM datos ORDER BY NUM DESC LIMIT 10"
        cursor.execute(sql)
        result = cursor.fetchall()

        # Procesa los resultados de la consulta
        timestamps = [row['TIMESTAMP'] for row in reversed(result)]
        tempExti = [row['TEMP'] for row in reversed(result)]
        tempNevi = [row['TEMPNEV'] for row in reversed(result)]
        humedadExti = [row['HUM'] for row in reversed(result)]
        humedadNevi = [row['HUMNEV'] for row in reversed(result)]
        luminosidadi = [row['LUX'] for row in reversed(result)]
        vientoi = [random.randint(12, 18) for _ in range(10)]

        global ultimo_almacenado
        ultimo_almacenado = timestamps[-1]
        print('ultimo = ', ultimo_almacenado)
        conn.close()
        
        return jsonify({"labels": timestamps, "luminosidadi": luminosidadi, "vientoi": vientoi, "tempExti": tempExti,
                        "tempNevi": tempNevi, "humedadExti": humedadExti, "humedadNevi": humedadNevi})
        
    except Exception as e:
        return str(e)
    
def buscar_ultimoDato():
    conn = conectar()
    cursor = conn.cursor()
    # Consulta para obtener los últimos 10 datos
    sql = "SELECT TIMESTAMP FROM datos ORDER BY NUM DESC LIMIT 1"
    cursor.execute(sql)
    respuesta = cursor.fetchone()
    ultimoDato_DB = respuesta[0]
    conn.close()
    return ultimoDato_DB

def actualizar_ultimoDato():

    global ultimo_almacenado
    
    if 'ultimo_almacenado' not in globals():
        print('La variable ultimo_almacenado no existe en el ámbito global')
        global ultimo_almacenado
        ultimo_almacenado = buscar_ultimoDato()
    else:
        print('La variable ultimo_almacenado ya existe en el ámbito global')
    

    conn = conectar()
    cursor = conn.cursor()
    # Consulta para obtener los últimos 10 datos
    sql = "SELECT TIMESTAMP, TEMP, TEMPNEV, HUM, HUMNEV, LUX FROM datos ORDER BY NUM DESC LIMIT 1"
    cursor.execute(sql)
    ultimoFila = cursor.fetchone()
    timestamp = ultimoFila[0]

    if ultimo_almacenado != timestamp :
        print(ultimo_almacenado)
        print(timestamp)
        print("Nuevos datos")
        conn.close()

        return jsonify({})
        
    else:

        print(ultimo_almacenado, '=', timestamp)
        print("No hay nuevos datos")

        
        variables = []
        for variable in ultimoFila[1:]:
            variables.append(variable)
        variables.append(random.randint(13,18))
        print(variables)
        ultimo_almacenado = timestamp

        conn.close()

        return jsonify({"label": timestamp, "variables":variables})