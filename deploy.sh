vite build
cp -Rf total5.js dist/
cp -Rf ./total5.zip dist/
cd dist

mkdir -p public/assets views node_modules

# Correct unzip syntax: extract into node_modules
npm init -y && npm i total5

cp -Rf assets/* public/assets/
cp -Rf index.html views/

node total5.js
