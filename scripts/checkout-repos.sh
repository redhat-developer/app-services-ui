echo "This script will delete ./modules folder and download all repositories"

read -p "Continue? (y/n): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

rm -Rf ./modules
mkdir modules

cd modules

echo "Cloning repositories"

git clone git@github.com:RedHatInsights/insights-proxy.git
git clone git@github.com:redhat-developer/app-services-guides.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/kafka-ui.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/kas-ui.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/cos-ui.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/srs-ui.git

echo "Updating insights container"

bash ./insights-proxy/scripts/update.sh
