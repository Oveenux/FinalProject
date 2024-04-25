# ========== COMMANDS NEEDED TO RUN WEB SERVER ==========

# OS: GNU/Linux (ubuntu)

# Give permissions to this file with the command:
# chmod 777 inicio.sh

# Run this file with the command:
# ./inicio.sh

# ---------- VIRTUAL ENVIRONMENT ----------

# It is advisable to create virtual environments to install libraries.
# You can do this with the followings commmands before running this file.

# sudo apt install python3-venv -y
# mkdir -p ~/envEcoMedix
# python3 -m venv ~/envEcoMedix
# source ~/envEcoMedix/bin/activate

# ----------------------------------------

repetir_caracter() {
    local caracter="$1"
    local ancho=$(tput cols)
    local cadena=$(printf "%-${ancho}s" "$caracter")
    echo "${cadena// /$caracter}"
}

# ---------- UPDATE PACKAGES ----------

sudo apt update
sudo apt upgrade -y
echo -e "\e[32m Packages Updated \e[0m"
repetir_caracter '='

# ---------- GIT AND GITHUB ----------

sudo apt install git -y
echo -e "\e[32m git Installed  \e[0m"
repetir_caracter '-'
git clone https://github.com/Oveenux/FinalProject.git
echo -e "\e[32m Repository Cloned \e[0m"
repetir_caracter '='

# ---------- PYTHON LIBRARIES ----------

sudo apt-get install python3-pip -y
echo -e "\e[32m pip for Pyhton Installed \e[0m"
repetir_caracter '-'
sudo pip install Flask			        # Library for Web Server
echo -e "\e[32m Flask Installed \e[0m"
repetir_caracter '-'
sudo pip install mysql-connector-python	# Library for connection to database
echo -e "\e[32m MySQL connector for Python Installed \e[0m"
repetir_caracter '-'


echo -e "\e[32m Libraries Installed \e[0m"
repetir_caracter '='

echo -e "\e[32m FINISHED! \e[0m"
