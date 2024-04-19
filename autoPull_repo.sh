repetir_caracter() {
    local caracter="$1"
    local ancho=$(tput cols)
    local cadena=$(printf "%-${ancho}s" "$caracter")
    echo "${cadena// /$caracter}"
}

contador=1
while true; do
    git pull origin main
    echo -e "\e[32mPull $contador: $(TZ='America/Bogota' date +"%T")\e[0m"
    ((contador++))
    repetir_caracter '='
    # Espera 5 minutos antes de la próxima ejecución
    sleep 3
done
