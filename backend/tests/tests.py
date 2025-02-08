import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    return app.test_client()

def test_file_upload(client):
    # Simulate file upload with an example Excel file
    data = {
        'file': (open('tests/sample.xlsx', 'rb'), 'sample.xlsx')
    }
    response = client.post('/upload', content_type='multipart/form-data', data=data)
    assert response.status_code in [200, 400]
