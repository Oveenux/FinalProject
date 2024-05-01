# Script for automatic deployment of changes in the repository

imprimir_mensaje_pull() {
    local contador="$1"
    local resultado="$2"
    local color="$3"
    echo -e "\e[${color}mPull $contador: $resultado - - [$(TZ='America/Bogota' date +"%F %T")]\e[0m"
}

info_pull() {
    local numero="$1"
    echo -e "\e[36m${numero} - - $mensaje_commit - - [$fecha_commit]\e[0m"
    echo -e "\e[36mRealizado por $autor_commit\e[0m"
}

repetir_caracter() {
    local caracter="$1"
    local ancho=$(tput cols)
    local cadena=$(printf "%-${ancho}s" "$caracter")
    echo "${cadena// /$caracter}"
}

contador=1
request_anterior=0

while true; do 
    if salida=$(git pull origin main 2>&1); then
        numero_commit=$(git rev-list --count HEAD)
        mensaje_commit=$(git log --pretty=format:"%s" -1)
        fecha_commit=$(git log -1 --format="%ad" --date=iso | cut -c 1-19)
        autor_commit=$(git log -1 --format="%an")
        if [[ $salida == *"Already up to date"* ]]; then
            if [[ $request_anterior != *"Already up to date"* ]]; then
                echo "$salida"
                imprimir_mensaje_pull "$contador" "SIN CAMBIOS" "34"
                request_anterior="$salida"
                ((contador++))
                repetir_caracter '='
            fi
        else
            echo "$salida"
            info_pull "COMMIT #$numero_commit"
            imprimir_mensaje_pull "$contador" "EXITOSO!" "32"
            request_anterior="$salida"
            ((contador++))
            repetir_caracter '='
        fi
    else
        if [[ $salida == *"Please commit your changes or stash them before you merge"* ]]; then
            echo -e "\e[31mError: Necesitas hacer commit o stash de tus cambios antes de hacer merge.\e[0m"
            imprimir_mensaje_pull "$contador" "FALLIDO" "31"
            repetir_caracter '='
        else
            imprimir_mensaje_pull "$contador" "FALLIDO" "31"
            repetir_caracter '='
        fi
    fi
    # Espera 1 minuto (60 segundos) antes de la próxima ejecución
    sleep 60
done