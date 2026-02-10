![CI](https://github.com/classroom-dee/color-ensemble/actions/workflows/main.yaml/badge.svg)

### Overview
The classic "I can't control the urge to expand my PoC project" type of project

### Dev
1. `pip install pre-commit && pre-commit install`
2. `cd server && pip install -e . && uvicorn app.run:app --reload --reload-dir ./`
3. New terminal, `cd client && npm i && npm run dev`

### Test
- Assuming deps are installed,
- `cd client && npm run test:unit`
- `cd server && pytest`
- e2e not implemented yet

### TODO
- Fav harmonies view + unit test (endpoint is done)
- Polish components
- e2e test