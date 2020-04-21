import sys
sys.path.append('../src')

import data
import errors
import requests
import stdlib.json
import json

def get(*args):
    if len(args) == 2:
        tuplist = []
        for item in list(args[1].val):
            tuplist.append(item.val)
        auth = tuple(tuplist)
    else:
        auth = ()
    print(auth)
    r = requests.get(args[0].val, auth=auth).text
    return data.String(r)

    

attrs = {
    'httpget': data.Method(get),
}
