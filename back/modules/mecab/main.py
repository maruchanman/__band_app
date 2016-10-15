# coding: utf8
import pandas as pd
from .dict import Dict
from ..util.conn import Connect

def update_band_dic():
    db = Connect()
    with db.connect("remote").cursor() as cur:
        cur.execute("SELECT name FROM band")
        bands = [x[0] for x in cur.fetchall()]
    d = Dict("bands")
    d.words_to_csv(bands, "バンド")
    d.dict_from_csv(d.dict_csv)
