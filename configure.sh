python3 -mvenv .e
. .e/bin/activate
pip install tinybird-cli
tb auth --interactive
cp .tinyb data-project/.tinyb
cd data-project && tb push --fixtures && cd ..
cp .env.example .env