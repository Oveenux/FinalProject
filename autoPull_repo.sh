repetir_caracter() {
    local caracter="$1"
    local ancho=$(tput cols)
    local cadena=$(printf "%-${ancho}s" "$caracter")
    echo "${cadena// /$caracter}"
}

contador=1
while true; do
    if git pull origin main; then
        echo -e "\e[32mPull $contador: Exitoso - - [$(TZ='America/Bogota' date +"%F %T")]\e[0m"
    else
        echo -e "\e[31mPull $contador: Fallido - - [$(TZ='America/Bogota' date +"%F %T")]\e[0m"
    fi
    ((contador++))
    repetir_caracter '='
    # Espera 5 minutos antes de la próxima ejecución
    sleep 300
done
