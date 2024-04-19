# Script for automatic deployment of changes in the repository

imprimir_mensaje_pull() {
    local contador="$1"
    local resultado="$2"
    local color="$3"
    echo -e "\e[${color}mPull $contador: $resultado - - [$(TZ='America/Bogota' date +"%F %T")]\e[0m"
}

repetir_caracter() {
    local caracter="$1"
    local ancho=$(tput cols)
    local cadena=$(printf "%-${ancho}s" "$caracter")
    echo "${cadena// /$caracter}"
}

contador=1

while true; do
    if salida=$(git pull origin main 2>&1); then
        echo "$salida"
        imprimir_mensaje_pull "$contador" "Exitoso" "32"
    else
        if [[ $salida == *"Please commit your changes or stash them before you merge"* ]]; then
            echo -e "\e[31mError: Necesitas hacer commit o stash de tus cambios antes de hacer merge.\e[0m"
            imprimir_mensaje_pull "$contador" "Fallido" "31"
        else
            imprimir_mensaje_pull "$contador" "Fallido" "31"
        fi
    fi
    ((contador++))
    repetir_caracter '='
    # Espera 5 minutos antes de la próxima ejecución
    sleep 300
done
