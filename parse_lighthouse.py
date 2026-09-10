import json
import sys

def parse():
    with open('lighthouse-report.json') as f:
        data = json.load(f)
    
    perf = data['categories']['performance']['score'] * 100 if data['categories']['performance'].get('score') else 'N/A'
    fcp = data['audits']['first-contentful-paint']['displayValue']
    lcp = data['audits']['largest-contentful-paint']['displayValue']
    tbt = data['audits']['total-blocking-time']['displayValue']
    cls = data['audits']['cumulative-layout-shift']['displayValue']
    
    print(f"Performance Score: {perf}")
    print(f"First Contentful Paint: {fcp}")
    print(f"Largest Contentful Paint: {lcp}")
    print(f"Total Blocking Time: {tbt}")
    print(f"Cumulative Layout Shift: {cls}")
    
    print("\nOpportunities:")
    for key, audit in data['audits'].items():
        if audit.get('details') and audit['details'].get('type') == 'opportunity':
            if audit.get('score', 1) < 1:
                savings = audit['details'].get('overallSavingsMs', 0)
                bytes_savings = audit['details'].get('overallSavingsBytes', 0)
                print(f"- {audit['title']}: Save {savings}ms or {bytes_savings/1024:.2f}KB")

    print("\nNetwork Requests Summary:")
    network_requests = data['audits'].get('network-requests')
    if network_requests and 'details' in network_requests:
        total_size = sum(item.get('transferSize', 0) for item in network_requests['details']['items'])
        print(f"Total Transfer Size: {total_size/1024:.2f} KB")
        num_requests = len(network_requests['details']['items'])
        print(f"Total Requests: {num_requests}")

if __name__ == '__main__':
    parse()
