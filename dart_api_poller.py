import time, requests, xml.etree.ElementTree as ET
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("urban-computing-fa797-firebase-adminsdk-fbsvc-41afd20c52.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

URL = "http://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=D"
NS = {"ir": "http://api.irishrail.ie/realtime/"}
POLL_S = 60

def fetch_darts():
    r = requests.get(URL, timeout=15)
    r.raise_for_status()
    root = ET.fromstring(r.content)
    trains = []
    for t in root.findall("ir:objTrainPositions", NS):
        get = lambda tag: t.findtext(f"ir:{tag}", default="", namespaces=NS)
        trains.append({
            "train_code": get("TrainCode"),
            "status": get("TrainStatus"),          # N = not started, R = running, T = terminated
            "lat": float(get("TrainLatitude")),
            "lon": float(get("TrainLongitude")),
            "direction": get("Direction"),
            "message": get("PublicMessage").replace("\\n", " | "),
        })
    return trains

while True:
    try:
        trains = fetch_darts()
        db.collection("dart_snapshots").add({
            "fetched_at": firestore.SERVER_TIMESTAMP,
            "count": len(trains),
            "trains": trains,
        })
        print(time.strftime("%H:%M:%S"), "stored", len(trains), "DARTs")
    except Exception as e:
        print("poll failed:", e)               # keep going; the next poll may succeed
    time.sleep(POLL_S)
