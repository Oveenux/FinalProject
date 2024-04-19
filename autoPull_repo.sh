contador=1
while true; do
    git pull origin main
    echo -e "\e[32mPull $contador: $(TZ='America/Bogota' date +"%T")\e[0m"
    # Espera 5 minutos antes de la próxima ejecución
    sleep 300
done
