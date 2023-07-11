python3 -mvenv .e
. .e/bin/activate
pip install tinybird-cli
tb auth --interactivex
cd data-project && tb push --fixtures && cd ..