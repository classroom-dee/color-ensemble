from app.services.color_harmony import normalize_color, generate_harmonies


def test_normalize_hex_roundtrip():
    c = normalize_color(hex='#ff0000')
    assert c.hex == '#ff0000'
    assert c.rgb == (255, 0, 0)
    h, s, _l = c.hsl
    assert 0 <= h < 360
    assert 0 <= s <= 1
    assert 0 <= _l <= 1


def test_harmony_complementary_red_is_cyan():
    base = normalize_color(hex='#ff0000')
    harms = generate_harmonies(base)
    comp = harms['complementary'][0]
    assert comp.hex == '#00ffff'


def test_harmony_endpoint(client):
    r = client.post('/colors/harmony', json={'hex': '#00ff00'})
    assert r.status_code == 200
    data = r.json()
    assert data['input']['hex'] == '#00ff00'
    assert set(data['harmonies'].keys()) == {
        'complementary',
        'analogous',
        'triadic',
        'split_complementary',
    }
    assert len(data['harmonies']['complementary']) == 1
    assert len(data['harmonies']['analogous']) == 2


def test_favorites_crud(client, auth_header):
    # add
    r = client.post('/favorites', json={'hex': '#abc'}, headers=auth_header)
    assert r.status_code == 201
    fav = r.json()
    assert fav['hex'] == '#aabbcc'
    fav_id = fav['id']

    # list
    r = client.get('/favorites', headers=auth_header)
    assert r.status_code == 200
    lst = r.json()
    assert any(x['id'] == fav_id for x in lst)

    # delete
    r = client.delete(f'/favorites/{fav_id}', headers=auth_header)
    assert r.status_code == 204

    # list empty
    r = client.get('/favorites', headers=auth_header)
    assert r.status_code == 200
    assert all(x['id'] != fav_id for x in r.json())
