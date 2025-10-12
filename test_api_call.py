from api import create_app

def run_tests():
    app = create_app()
    client = app.test_client()

    print('CALL /api/market_trends?q=night camera')
    resp = client.get('/api/market_trends?q=night camera')
    print('STATUS', resp.status_code)
    print(resp.get_json())

    print('\nCALL /api/documents/drones')
    resp2 = client.get('/api/documents/drones')
    print('STATUS', resp2.status_code)
    print(resp2.get_json())

    print('\nCALL /api/documents/ballistic missiles')
    resp3 = client.get('/api/documents/ballistic missiles')
    print('STATUS', resp3.status_code)
    print(resp3.get_json())

if __name__ == '__main__':
    run_tests()
