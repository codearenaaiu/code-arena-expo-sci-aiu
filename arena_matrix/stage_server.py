import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import time

PORT = 8080
cached_bridge_data = {}

class StageHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path.startswith("/api/push_leaderboard"):
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8")
            try:
                payload = json.loads(body)
                slug = payload.get("slug", "default")
                cached_bridge_data[slug] = {
                    "timestamp": time.time(),
                    "data": payload.get("data", {"models": []})
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return
        self.send_response(404)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/leaderboard"):
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            slug = params.get("slug", ["code-arena-sim-3-qualifiers"])[0].strip()

            # 1. If the Chrome Tab Bridge pushed fresh data in the last 30s, use it
            if slug in cached_bridge_data and (time.time() - cached_bridge_data[slug]["timestamp"] < 30):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(cached_bridge_data[slug]["data"]).encode("utf-8"))
                return

            # 2. Otherwise fetch directly from HackerRank REST API
            hr_url = f"https://www.hackerrank.com/rest/contests/{slug}/leaderboard?offset=0&limit=100"
            req = urllib.request.Request(
                hr_url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                    "Accept": "application/json"
                }
            )
            try:
                with urllib.request.urlopen(req, timeout=6) as resp:
                    raw = resp.read().decode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(raw.encode("utf-8"))
            except Exception as e:
                # If fallback cache exists, return it; otherwise return status error
                if slug in cached_bridge_data:
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps(cached_bridge_data[slug]["data"]).encode("utf-8"))
                else:
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"models": [], "error": str(e)}).encode("utf-8"))
            return

        return super().do_GET()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), StageHandler) as httpd:
        print(f"============================================================")
        print(f">_ CODE ARENA STAGE ENGINE LIVE AT: http://localhost:{PORT}")
        print(f"============================================================")
        httpd.serve_forever()