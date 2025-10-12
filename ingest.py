import requests
import pandas as pd
from xml.etree import ElementTree as ET

def fetch_arxiv_data(topic: str, max_results: int = 10) -> pd.DataFrame:
    base_url = "http://export.arxiv.org/api/query"
    params = {
        "search_query": f"all:{topic}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }
    try:
        response = requests.get(base_url, params=params, timeout=15)
        response.raise_for_status()
        root = ET.fromstring(response.content)
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        all_papers = []
        for entry in root.findall('atom:entry', ns):
            paper_data = {
                'id': entry.find('atom:id', ns).text,
                'title': entry.find('atom:title', ns).text.strip(),
                'summary': entry.find('atom:summary', ns).text.strip(),
                'published': entry.find('atom:published', ns).text[:10],
                'authors': [a.find('atom:name', ns).text for a in entry.findall('atom:author', ns)],
                'source': 'arxiv',
                'provider_company': 'N/A',
                'funding_details': ''
            }
            all_papers.append(paper_data)
        if not all_papers:
            return pd.DataFrame()
        relevant = []
        kw = set(topic.lower().split())
        for p in all_papers:
            content = (p['title'] + ' ' + p['summary']).lower()
            if any(k in content for k in kw):
                relevant.append(p)
        if not relevant:
            relevant = all_papers[:max_results]
        return pd.DataFrame(relevant[:max_results])
    except Exception:
        return pd.DataFrame()
