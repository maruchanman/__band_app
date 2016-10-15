import subprocess as sh


class Dict(object):
  
  def __init__(self, dict_name, dict_csv_name, dict_index_path, dict_space_path):
    self.dict_name = dict_name
    self.dict_csv = dict_csv_name
    self.dict_index_path = dict_index_path
    self.dict_space_path = dict_space_path

  # csvデータを辞書に変換
  def dict_from_csv(self, csvfile):
    return sh.call([self.dict_index_path, "-d", self.dict_space_path, "-u", self.dict_name, "-f", "utf8", "-t", "utf8", csvfile])

  # 名詞の辞書形式に変換
  def makeline(self, word, word_tag):
    word = str(word)
    cost = int(max(-36000, -400 * len(word)**1.5))
    return "%s,0,0,1,名詞,一般,*,*,*,*,%s,*,%s\n" % (word, word, word_tag)

  # 辞書に追加できるかチェック
  def add_check(self, word):
    f = open("addtest.csv", "w")
    f.write(self.makeline(word, "test"))
    f.close()
    if len(word) > 1:
      if self.dict_from_csv("addtest.csv") == 0:
        return True
      else:
        return False
    else:
      return False
  
  # 単語リストをcsvデータに変換
  def words_to_csv(self, words, word_tag):
    f = open(self.dict_csv, "w")
    logg = open("logg.txt", "w")
    cnt = 0
    for word in [str(x) for x in words]:
      cnt += 1
      print("processing: %d / %d" % (cnt, len(words)))
      if self.add_check(word):
        line = self.makeline(word, word_tag)
        f.write(line)
        logg.write("%s: ok\n" % word)
      else:
        logg.write("%s: error!!\n" % word)
    f.close()
    logg.close()

  # 辞書を反映させる
  def mvdict(self):
    sh.call(["cp", "-f", self.dict_name, self.dict_space_path]) 
