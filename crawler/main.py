import sys
import os
import tempfile
import fetch
import build_db
import pack

if __name__ == "__main__":
    sem = sys.argv[1]
    root = "workspace"
    os.makedirs(root, exist_ok=True)
    print("Work directory:", root)
    print("Fetch Stage")
    fetch.work(sem, root)
    print("Build Stage")
    build_db.work(sem, root)
    print("Upload Stage")
    upload.work(sem, root)
    print("Finish")
