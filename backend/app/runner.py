import os
import subprocess
import time
import threading

PYTHON = r"C:\Users\savan\AppData\Local\Microsoft\WindowsApps\python.exe"

def run_listener():
    subprocess.Popen([PYTHON, "app/listener/solana_listener.py"])

listener_thread = threading.Thread(target=run_listener)
listener_thread.start()

print("Continuous ML Engine Running...")

while True:
    print("\n Building dataset...")
    os.system(f"{PYTHON} app/pipeline/build_dataset.py")

    print("\n Training model...")
    os.system(f"{PYTHON} app/trainer/train_model.py")

    print("\n Sleeping 5 min...")
    time.sleep(300)