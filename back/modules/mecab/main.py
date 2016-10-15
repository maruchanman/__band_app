# coding: utf8
import pandas as pd
from .dict import Dict

dict_name = "bands.dic"
dict_csv_name = "dict_bands.csv"
dict_index_path = "/usr/local/Cellar/mecab/0.996/libexec/mecab/mecab-dict-index"
dict_space_path = "/usr/local/lib/mecab/dic/ipadic/"

dataframe_path = "/Users/hacker/work/lives/flask/csv/check.csv"
dataframe_column = "band"

df = pd.read_csv(dataframe_path, index_col=0)
# check here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
df = df[df.flag == 1]
bands = list(df[dataframe_column])
d = Dict(dict_name, dict_csv_name, dict_index_path, dict_space_path)
d.words_to_csv(bands, "バンド")
d.dict_from_csv(d.dict_csv)
d.mvdict()
