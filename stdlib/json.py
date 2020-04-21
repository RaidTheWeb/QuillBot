import sys
sys.path.append("../src")

import data
import errors
import json


class mapEncoder(json.JSONEncoder):
    def default(self, o):
        outdict = {}
        for key in o.attrs.keys():
            if not isinstance(o.attrs[key], data.Method):
                if isinstance(o.attrs[key], data.String) or isinstance(o.attrs[key], data.Number):
                    outdict[key] = o.attrs[key].val
        return outdict
        

def dumps(mapobj, filename):
    dumped = json.dumps(mapobj, cls=mapEncoder)
    open(filename.val, 'w').write(dumped)
    return data.String(dumped)

def loads(filename):
    jsondata = open(filename.val, 'r').read()
    loaded = json.loads(jsondata)
    mymap = data.Map(data.String(""), data.String(""))
    for key in loaded.keys():
        if isinstance(loaded[key], str):
            mymap.set(data.String(key), data.String(loaded[key]))
        elif isinstance(loaded[key], float):
            mymap.set(data.String(key), data.Number(loaded[key]))
        else:
            continue
    return mymap


attrs = {
    'dumps': data.Method(dumps),
    'loads': data.Method(loads),
}
