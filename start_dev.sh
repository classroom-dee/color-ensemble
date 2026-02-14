#!/bin/bash

cd client
npm run build
cd ../server
uvicorn app.run:app --host 0.0.0.0 --port 8000