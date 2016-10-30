# coding: utf8
import datetime
from .rape import Rape
from ..util.insert import Insert


def prevmonth(date):
    if date.month == 1:
        return datetime.date(date.year - 1, 12, 1)
    else:
        return datetime.date(date.year, date.month - 1, 1)

rape = Rape()
house_df = rape.house_df()
insert = Insert("remote")
insert.insert_house(house_df)
date = datetime.date.today() + datetime.timedelta(days=30)
for delta in range(24):
    print('\nRaping: {0}/{1}\n'.format(date.year, date.month))
    rape.set(date.year, date.month)
    r = rape.execute(house_df)
    insert.insert_live(r)
    date = prevmonth(date)
