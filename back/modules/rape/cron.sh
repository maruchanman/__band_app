#!/bin/sh

echo `date` >> /home/kadoya/bandapp/back/modules/rape/cronlog.txt
source ~/.bash_profile
cd /home/kadoya/bandapp/back
python -m modules.rape.main &
