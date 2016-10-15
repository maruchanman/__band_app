# coding: utf8
import pandas as pd
from ..util.insert import Insert

def house(handle):
    df = pd.read_csv("./modules/rape/house.csv")
    handle.insert_house(df)
def band(handle):
    df = pd.read_csv("./modules/flask/csv/check.csv")
    df = df[df.flag == 1]
    handle.insert_band(df)

if __name__ == "__main__":

    handle = Insert("local")
    # house(handle)
    band(handle)
