echo "This script will delete ./modules folder and download all repositories"

read -p "Continue? (y/n): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

rm -Rf ./modules
mkdir modules

cd modules

echo "Cloning repositories"

git clone git@github.com:redhat-developer/app-services-guides.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/kafka-ui.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/kas-ui.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/cos-ui.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/srs-ui.git
git clone git@github.com:bf2fc6cc711aee1a0c2a/ads-ui.git


read -p "Do you wish to install all dependencies for projects? (y/n): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

npm --prefix app-services-guides/.build install
npm --prefix kafka-ui install
npm --prefix kas-ui install
npm --prefix cos-ui install
npm --prefix srs-ui install
npm --prefix ads-ui install
