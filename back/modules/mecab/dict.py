# coding: utf8
import os
import subprocess as sh

DIR = os.path.dirname(__file__)


class Dict(object):
  
    def __init__(self, name):
        self.dict_name = "{0}/{1}.dic".format(DIR, name)
        self.dict_csv = "{0}/dict_{1}.csv".format(DIR, name)
        self.test_csv = "{0}/addtest.csv".format(DIR)
        self.dict_index_path = "/usr/libexec/mecab/mecab-dict-index"
        self.dict_ipadic_path = "/usr/lib64/mecab/dic/ipadic"

    def words_to_csv(self, words, tag):
        f = open(self.dict_csv, "w")
        cnt = 0
        for word in [str(x) for x in words]:
            cnt += 1
            print("{0}/{1}".format(cnt, len(words)))
            if self.__addcheck(word):
                line = self.__makeline(word, tag)
                f.write(line)
        f.close()

    def dict_from_csv(self, csvfile):
        return sh.call([
            self.dict_index_path,
            "-d", self.dict_ipadic_path,
            "-u", self.dict_name,
            "-f", "utf8", "-t", "utf8", csvfile])

    def __addcheck(self, word):
        with open(self.test_csv, "w") as f:
            f.write(self.__makeline(word, "test"))
        if len(word) > 1:
            return True if self.dict_from_csv(self.test_csv) == 0 else False
        else:
            return False

    def __makeline(self, word, tag):
        return "{word},0,0,1,名詞,一般,*,*,*,*,{word},*,{tag}\n".format(word=word, tag=tag)
