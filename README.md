# yt-manager-free

A lightweight project for managing YouTube links and local media tracking.

## Overview

`yt-manager-free` is a simple command-line project for organizing YouTube content you want to keep track of locally.

It currently supports:

- adding YouTube URLs to a local library
- listing saved URLs
- removing items from the library
- clearing the entire library

## Quick Start

```bash
npm start -- add "https://www.youtube.com/watch?v=example"
npm start -- list
npm start -- remove 1
npm start -- clear
```

## Project Structure

- `src/index.js` — main CLI entry point
- `.data/library.json` — local library storage

## Notes

This project is intentionally lightweight and easy to extend. It is a good starting point for adding metadata, searches, and downloads later.
