
echo "Synchronizing managed-services-api & AMS"

curl --insecure -L -o hack/kas-fleet-manager.yaml https://gitlab.cee.redhat.com/service/kas-fleet-manager/-/raw/master/openapi/kas-fleet-manager.yaml

curl  -L -o hack/ams.json https://api.stage.openshift.com/api/accounts_mgmt/v1/openapi

echo "Finished synchronization with managed-services-api & AMS"
