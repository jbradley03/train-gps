import csv
import firebase_admin
from firebase_admin import credentials, firestore

# 1. Initialize the Admin SDK
cred = credentials.Certificate('urban-computing-fa797-firebase-adminsdk-fbsvc-41afd20c52.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Configuration
csv_file_path = 'gps_2026-10-23-13-18.csv'
 
collection_name = 'Clontarf Road to Malahide'    # Target Firestore collection

def import_csv():
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        # csv.DictReader automatically maps headers as keys
        csv_reader = csv.DictReader(file)
        
        batch = db.batch()
        count = 0
        
        for row in csv_reader:
            # Create an auto-generated document reference
            doc_ref = db.collection(collection_name).document()
            batch.set(doc_ref, row)
            count += 1
            
            # Firestore batch write limit is 500 operations
            if count % 500 == 0:
                batch.commit()
                batch = db.batch()  # Reset batch
                print(f"Uploaded {count} rows...")
                
        # Commit any leftover documents
        if count % 500 != 0:
            batch.commit()
            
        print(f"Finished! Successfully imported {count} documents to collection '{collection_name}'.")

if __name__ == '__main__':
    import_csv()
