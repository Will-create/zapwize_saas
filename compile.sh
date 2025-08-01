vite build
cd dist

mkdir -p /www/www/zapwize_com/public/assets /www/www/zapwize_com/views

cp -Rf assets/* /www/www/zapwize_com/public/assets/
cp -Rf index.html /www/www/zapwize_com/views/
echo "Compilation complete. Files copied to /www/www/zapwize_com/public/assets and /www/www/zapwize_com/views."
