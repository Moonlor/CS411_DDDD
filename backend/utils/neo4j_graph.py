from utils.config import Config
import requests
import json

config = Config()


def query(query_list):
    headers = {
        'Content-Type': 'application/json',
    }

    for i in range(len(query_list)):
        query_list[i] = query_list[i].replace('\n', '')

    queries = [{"statement": x} for x in query_list]

    data = {
        "statements": queries
    }

    response = requests.post(config.http_url,
                             headers=headers,
                             data=json.dumps(data),
                             auth=(config.username, config.password))

    return response.json()
