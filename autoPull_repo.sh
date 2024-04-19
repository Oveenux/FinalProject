repetir_caracter() {
    local caracter="$1"
    local ancho=$(tput cols)
    local cadena=$(printf "%-${ancho}s" "$caracter")
    echo "${cadena// /$caracter}"
}

contador=1
while true; do
    if salida=$(git pull origin main 2>&1); then
        echo -e "\e[32mPull $contador: $(TZ='America/Bogota' date +"%T")\e[0m"
    else
        if [[ $salida == *"Please commit your changes or stash them before you merge"* ]]; then
            echo -e "\e[31mError: Necesitas hacer commit o stash de tus cambios antes de hacer merge.\e[0m"
        else
            echo -e "\e[31mError al hacer pull en el intento $contador: $(TZ='America/Bogota' date +"%F %T")\e[0m"
        fi
    fi
    ((contador++))
    repetir_caracter '='
    # Espera 5 minutos antes de la próxima ejecución
    sleep 300
done
