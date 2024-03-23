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
echo -e "\e[32m Updated packages \e[0m"
repetir_caracter '='

# ---------- GIT AND GITHUB ----------

sudo apt install git -y
echo -e "\e[32m Installed git \e[0m"
repetir_caracter '-'
git clone https://github.com/Oveenux/FinalProject.git
echo -e "\e[32m Cloned repository \e[0m"
repetir_caracter '='

# ---------- PYTHON LIBRARIES ----------

sudo apt-get install python3-pip -y
echo -e "\e[32m Installed pip for Pyhton \e[0m"
repetir_caracter '-'
sudo pip install Flask			# Library for Web Server
repetir_caracter '-'
pip install numpy
repetir_caracter '-'
pip install mysql-connector-python	# Library for connection to database
repetir_caracter '-'


echo -e "\e[32m Installed libraries \e[0m"
repetir_caracter '='

echo -e "\e[32m FINISHED! \e[0m"
