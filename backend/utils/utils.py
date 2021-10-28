import datetime

def datetime_to_string(profile):
    for i in range(len(profile)):
        try:
            if type(profile[i]) == datetime.datetime:
              profile[i] = profile[i].strftime("%m/%d/%Y, %H:%M:%S")
        except Exception as e:
            print(e)

def string_to_datetime(time):
    converted = None
    try:
        converted = datetime.datetime.strptime(time, "%Y-%m-%d %H:%M:%S")
    except Exception as e:
        print(e)
    return converted