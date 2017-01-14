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

    def execute(self, houses):
        arr = []
        for houseID, data in houses.items():
            live = {
                "houseID": houseID, "year": self.year, "month": self.month}
            soup = self._croll(data)
            if soup:
                live["data"] = self._extract(soup, data)
                if live["data"]:
                    arr.append(live)
                else:
                    self._error(data, "extract failed")
            else:
                self._error(data, "url is invalid")
        return arr

    def houses(self):
        with open("{}/house.json".format(RAPE_DIR), "r") as f:
            return json.load(f)

    def _error(self, data, msg):
        with open("{}/errorlog.txt".format(RAPE_DIR), "a") as f:
            f.write("\n{}: {}\n".format(data["name"], self.__fix_url(data["url"])))
            f.write(msg)
            f.write("\n")

    def _croll(self, data):
        url = self.__fix_url(data["url"])
        soup = self.__soup(url, data)
        return soup

    def _extract(self, soup, data):
        r = []
        boxes = self.__extract_box(soup, data)
        if not boxes:
            return False
        for obj in boxes:
            day, html = obj["day"], obj["box"]
            infos = re.findall(data["open"], html)
            for ix, info in enumerate(infos):
                time = [x for x in re.findall("\d{2}:\d{2}", info.replace('：', ':'))]
                price = [
                    x for x in re.findall(
                        "\d{1,3}00", info.replace(",", "").replace(".", "")) if int(x)!=0 and int(x) < 20000]
                context = self.__to_context(html, infos, ix)
                bands = self.__extract_bands(context)
                r.append({
                    "date": day,
                    "time": time,
                    "price": price,
                    "bands": bands,
                    "html": context
                })
        return r

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
        if data["url"].find("%") != -1:
            res = requests.get(url, headers=headers)
        else:
            res = requests.get(url, headers=headers) if self.today.month == self.month and self.today.year == self.year else None
        if res is None:
            return False
        soup = BeautifulSoup(res.text.encode(res.encoding))
        if len(str(soup)) < 1000:
            return False
        #driver = webdriver.PhantomJS()
        #driver.get(url)
        #soup = driver.page_source
        return soup

    def __extract_box(self, soup, data):
        html = str(soup)
        html = re.split(data["end"], html)[0]
        date_tags = re.findall(data["date"], html)
        if len(date_tags) == 0:
            print("date_tag is invalid")
            return False
        days = self.__extract_day(date_tags)
        boxes = re.split(data["date"], html)[1 : len(days) + 1]
        boxes = [re.sub("\n", "/", x) for x in boxes]
        boxes = [re.sub("\r", "/", x) for x in boxes]
        return [{"day": d, "box": b} for d, b in zip(days, boxes)]

    def __extract_day(self, tags):
        numbers = [re.findall('\d{1,4}', tag) for tag in tags]
        variations = [len(set([x[n] for x in numbers])) for n in range(len(numbers[0]))]
        idx = variations.index(max(variations))
        days = [int(x[idx]) for x in numbers]
        conv_points = [y for x, y in zip(days[:-1], days[1:]) if x > y]
        days = days[:days.index(conv_points[0])] if len(conv_points) > 0 else days
        return days

    def __to_context(self, box, infos, ix):
        if len(infos) == 1:
            context = box
        else:
            if ix == 0:
                context = box.split(infos[0])[0] + infos[0]
            else:
                context = box.split(infos[ix])[0].split(infos[ix - 1])[1] + infos[ix]
        context = re.sub("<.+?>", "/", context)
        context = re.sub("\s{2,}", " ", context)
        context = re.sub("/{2,}", "/", context)
        return context

    def __extract_bands(self, html):
        text = self.__fix_html_for_band(html)
        tagger = MeCab.Tagger('-u {}/bands.dic'.format(DIC_DIR))
        r = []
        for line in [x for x in tagger.parse(text).split('\n') if x.split(',')[-1] == 'バンド']:
            band = line.split(',')[0].split('\t')[0]
            for extracted in [x.strip() for x in text.split("/") if x.find(band) != -1]:
                if len(band) > 4:
                    if len(extracted.replace(band, "")) < 2 * len(band):
                        r.append(band)
                else:
                    if len(extracted.replace(band, "")) < 1:
                        r.append(band)
        r = list(set(r)) if len(r) > 0 else []
        return r

    def __fix_html_for_band(self, html):
        with open("./{}/replace_patterns.json".format(RAPE_DIR), "r") as f:
            patterns = json.load(f)
            for before, after in patterns.items():
                html = html.replace(before, after)
        with open("./{}/remove_patterns.json".format(RAPE_DIR), "r") as f:
            patterns = json.load(f)
            for pattern in patterns:
                html = re.sub(pattern, "", html)
        return html

    def _zerohead(self, number):
        return str(number) if number > 9 else '0{}'.format(number)
