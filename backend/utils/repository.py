# -*- coding: utf-8 -*


class Repository(object):
    def __init__(self):
        pass

    def rel_nodes(self, r):
      original_r = r['results'][0]['data']
      new_r = []
      for it in original_r:
        temp = {
            "id": it['meta'][0]["id"],
            "source": it['row'][1]["id"],
            "target": it['row'][2]["id"],
            "source_node": it['row'][1],
            "target_node": it['row'][2],
            "label": it['row'][0]["rel"]
        }

        new_r.append(temp)
      
      return new_r

    def replace_meta(self, r):
      if len(r['results']) != 0:

        original_r = r['results'][0]['data']
        for it in original_r:
          it['meta'][0]["id"] = it['row'][0]["id"]

      return r

