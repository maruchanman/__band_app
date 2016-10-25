# coding: utf-8

import os
import re
import time
import json
import datetime
import MeCab
import requests
import urllib
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from collections import Counter
from ..mecab.main import update_band_dic

RAPE_DIR = "./modules/rape"
DIC_DIR = "./modules/mecab"


class Rape():

    def __init__(self):
        self.year = None
        self.month = None
        self.video_url = (
            "http://video.search.yahoo.co.jp/search?p=%s&ei=UTF-8&rkf=1&oq=")
        self.today = datetime.date.today()
        update_band_dic()

    def set(self, year, month):
        self.year = year
        self.month = month

    def execute(self, df):
        arr = []
        for houseID, data in df.iterrows():
            live = {
                "houseID": houseID, "year": self.year, "month": self.month}
            soup = self._croll(data)
            live["data"] = self._extract(soup, data) if soup else []
            arr.append(live)
        return arr

    def house_df(self):
        df = pd.read_csv("{}/house.csv".format(RAPE_DIR), index_col=0)
        df = df[(df.ctg == "a") | (df.ctg == "b")]
        return df

    def _croll(self, data):
        url = self.__fix_url(data.url)
        soup = self.__soup(url, data)
        return soup

    def _extract(self, soup, data):
        r = []
        boxes = self.__extract_box(soup, data)
        for box in boxes:
            dates = self.__extract_dates(box)
            rr = {}
            if len(dates) > 0:
                rr["date"] = dates
                rr["html"] = self.__extract_html(box)
                rr["image"] = self.__extract_image(box, self.__fix_url(data.url))
                rr["time"] = self.__extract_time(box)
                rr["price"] = self.__extract_price(box)
                rr["bands"] = self.__extract_band(rr["html"])
                r.append(rr)
        r = self.__fixdate(r)
        return r if r else []

    def __fix_url(self, url):
        url = url.replace("%4d", str(self.year))
        url = url.replace("%2d", str(self.year - 2000))
        url = url.replace("%d", str(self.month))
        url = url.replace("%s", self._zerohead(self.month))
        url = url.replace("%-s", str(self.month - 1))
        return url

    def __soup(self, url, data):
        headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.0; WOW64; rv:24.0) Gecko/20100101 Firefox/24.0'}
        try:
            if data.url.find("%") != -1:
                html = requests.get(url, headers=headers)
            else:
                html = requests.get(url, headers=headers) if self.today.month == self.month and self.today.year == self.year else '<body></body>'
            soup = BeautifulSoup(html.text.encode(html.encoding))
            return soup
        except:
            return False

    def __navigate(self, url):
        self.driver.get(url)
        tag = [x for x in tags if x.get_attribute("textContent").find('{}'.format(self.month)) != -1][0]
        return '<p></p>'

    def __extract_box(self, soup, data):
        if data.ctg == "a":
            boxes = soup.select(data.box)
        elif data.ctg == "b":
            comps = re.split(data.box.split(':')[0], str(soup.html))
            comps[-1] = comps[-1].split(data.box.split(':')[1])[0]
            boxes = [BeautifulSoup(x) for x in comps[1:]]
        elif data.ctg == "c":
            boxes = []
        else:
            boxes = []
        return boxes

    def __extract_dates(self, box):
        return [int(x) for x in re.findall("\d+", box.text) if x != '' and int(x) < 32]

    def __extract_html(self, box):
        html = box.text
        html = re.sub("\n", "/", html)
        html = re.sub("\t", "/", html)
        html = re.sub("\r", "/", html)
        html = re.sub(", ", "/", html)
        html = re.sub("／", "/", html)
        html = re.sub(" {2,}", " ", html)
        html = re.sub("/ +/", "/", html)
        html = re.sub("/ +", "/", html)
        html = re.sub(" +/", "/", html)
        html = re.sub("/+", "/", html)
        return html

    def __extract_time(self, box):
        infos = [x for x in re.findall("\d{2}:\d{2}", box.text.replace('：', ':'))]
        return infos

    def __extract_image(self, box, url):
        img = "NULL"
        for imgtag in box.select('img'):
            src = imgtag['src']
            text = imgtag.text
            if src.find('.gif') == -1 and text.find("data") == -1 and text.find("banner") == -1:
                img = urllib.parse.urljoin(url, src) if src.find("http") == -1 else src
                break
        return img

    def __extract_price(self, box):
        html = box.text.replace(",", "")
        prices = [x for x in re.findall("\d{2,3}00", html)]
        return prices

    def __extract_band(self, html):
        tagger = MeCab.Tagger('-u {}/bands.dic'.format(DIC_DIR))
        r = []
        for d in tagger.parse(html).split('\n'):
            if d.split(',')[-1] == 'バンド':
                print(d)
                band = d.split(',')[0].split('\t')[0]
                if band in html.split("/"):
                    r.append(band)
        r = list(set(r)) if len(r) > 0 else []
        return r

    def __fixdate(self, r):
        flag = 0
        for n in range(3):
            try:
                arr = [x["date"][n] for x in r]
                if max(Counter(arr).values()) / len(arr) < 0.3:
                    prev = 1
                    for ix, date in enumerate(arr):
                        if date >= prev:
                            r[ix]["date"] = date
                            prev2 = prev
                        else:
                            r[ix - 1]["date"] = prev2
                            r[ix]["date"] = date
                        prev = date
                    flag = 1
                    break
            except:
                pass
        return r if flag == 1 else False

    def _zerohead(self, number):
        return str(number) if number > 9 else '0{}'.format(number)
