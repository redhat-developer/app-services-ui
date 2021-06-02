
echo "Synchronizing managed-services-api & AMS"

curl  -L -o hack/ams.json https://api.stage.openshift.com/api/accounts_mgmt/v1/openapi

echo "Finished synchronization with managed-services-api & AMS"
