import json

def parse():
    with open('lighthouse-report.json') as f:
        data = json.load(f)
    
    print("Diagnostics:")
    audits_to_check = ['bootup-time', 'mainthread-work-breakdown', 'long-tasks', 'unminified-javascript', 'unused-javascript']
    for key in audits_to_check:
        audit = data['audits'].get(key)
        if audit:
            print(f"--- {audit['title']} ---")
            print(f"Score: {audit.get('score')}, Value: {audit.get('displayValue')}")
            if 'details' in audit and 'items' in audit['details']:
                for item in audit['details']['items'][:5]:
                    url = item.get('url', 'N/A')
                    total = item.get('total', 0)
                    duration = item.get('duration', 0)
                    print(f"  URL: {url}, Total/Duration: {total or duration}ms")

if __name__ == '__main__':
    parse()
