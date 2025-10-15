from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

CSV_FILE = "donations.csv"

# ensure csv exists with header
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp","cause","amount"])

@app.route("/donate", methods=["POST"])
def donate():
    data = request.get_json()
    try:
        amount = float(data.get("amount"))
        cause = data.get("cause","unknown")
    except Exception:
        return jsonify({"message":"Invalid payload"}), 400

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, cause, amount])

    msg = f"Thank you! Your donation of ₹{amount:.2f} for {cause} has been recorded."
    return jsonify({"message": msg}), 200


@app.route("/stats", methods=["GET"])
def stats():
    total = 0.0
    count = 0
    by_cause = {}
    last = None
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    amt = float(row.get("amount") or 0)
                except:
                    continue
                total += amt
                count += 1
                c = row.get("cause","unknown")
                by_cause[c] = by_cause.get(c, 0) + amt
                last = {"date": row.get("timestamp"), "amount": f"₹{amt:.2f}", "cause": c}
    # ensure keys for causes we expect (so chart labels stable)
    for key in ("food","education","health"):
        by_cause.setdefault(key, 0)

    return jsonify({
        "total_amount": round(total,2),
        "count": count,
        "last": last,
        "by_cause": by_cause
    })


if __name__ == "__main__":
    app.run(debug=True)
