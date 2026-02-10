#!/bin/bash

zip -r project.zip . \
    -x \
        "*/.pytest_cache/*" \
        "*/__pycache__/*" \
        "*/node_modules/*" \
        "*/.env" \
        "*/*.db" \
        "*/*.svg" \
        ".git/*"