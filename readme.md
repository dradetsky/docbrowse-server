docserver
=========

serves docs. like dash/zeal, but in a browser

obtaining docs
--------------

put dash/zeal-type docs in `/docsets`, and edit `docsetOpts` in
`query.js` (which should really be a yaml cfg file)

running
-------

### backend

```txt
npm i
npm run dev
```

### frontend

```txt
cd frontend
npm i
# this should really be in webpack pipeline
node src/gentype.js
npm run build
```
