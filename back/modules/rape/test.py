# coding: utf8
import sys
import datetime
from .rape import Rape

houseID = int(sys.argv[1])
today = datetime.date.today()
r = Rape()
r.set(today.year, today.month)
df_house = r._read_template()
data = df_house.ix[houseID]
soup = r._croll(data)
print(soup)
lives = r._extract(soup, data)
print(lives)