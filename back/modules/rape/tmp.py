# coding: utf8
import sys
import datetime
from .rape2 import Rape

houseID = sys.argv[1]
today = datetime.date.today()
r = Rape()
r.set(2017, 1)
houses = r.houses()
data = houses[houseID]
soup = r._croll(data)
lives = r._extract(soup, data)
